import { mapKeyValuePair, type ParamValue } from "./map-key-value-pair.ts";
import type { Paths } from "./paths.ts";

export class OptimizelyClient {
  public constructor(private token: string) {}

  public async requestUntyped<R>({
    path,
    method,
    params,
    version = "flags/v1",
    pages = Infinity,
  }: {
    path: string;
    method: string;
    params: unknown;
    version?: "flags/v1";
    pages?: number;
  }) {
    const allItems: unknown[] = [];
    let currentPageToken: string | undefined = undefined;
    let currentPage = 0;

    while (currentPage < pages) {
      const options = {
        method,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      };

      const pathParamsRegexGlobal = /:(\w+):/g;
      const pathParams = Array.from(path.matchAll(pathParamsRegexGlobal)).map(
        (m) => m[1],
      );

      const requestParams = { ...(params as Record<string, ParamValue>) };
      if (currentPageToken) {
        requestParams["page_token"] = currentPageToken;
      }

      const extractPathParams = Object.entries(requestParams).reduce<{
        path: string;
        params: Record<string, ParamValue>;
      }>(
        (accum, [key, value]) => {
          if (pathParams?.includes(key)) {
            return {
              path: accum.path.replaceAll(
                new RegExp(`:${key}:`, "g"),
                String(value),
              ),
              params: { ...accum.params },
            };
          }
          return {
            path: accum.path,
            params: { ...accum.params, [key]: value },
          };
        },
        { path, params: {} },
      );

      const queryString = Object.entries({
        ...(extractPathParams.params as Record<string, ParamValue>),
      })
        .flatMap(([key, value]) => mapKeyValuePair(key, value))
        .join("&");

      const queryStringPart = queryString.length > 0 ? `?${queryString}` : ``;
      const url = `https://api.optimizely.com/${version}/${extractPathParams.path}${queryStringPart}`;

      const result = await fetch(url, options);

      if (!result.ok) {
        let errorMessage = `HTTP ${result.status}`;
        try {
          const errorJson = (await result.json()) as {
            code: string;
            message: string;
          };
          errorMessage = `${result.status} [${errorJson.code}] ${errorJson.message}`;
        } catch {
          if (result.status === 401) {
            errorMessage = "401 Unauthorized - Invalid token";
          } else if (result.status === 403) {
            errorMessage = "403 Forbidden - Access denied";
          } else if (result.status === 404) {
            errorMessage = "404 Not Found";
          } else {
            errorMessage = `${result.status} ${result.statusText}`;
          }
        }

        throw new Error(`Returned statusCode ${errorMessage}`);
      }

      const responseData = await result.json();

      if (responseData.items && Array.isArray(responseData.items)) {
        allItems.push(...responseData.items);

        if (
          responseData.next_url &&
          Array.isArray(responseData.next_url) &&
          responseData.next_url.length > 0
        ) {
          const nextUrl = responseData.next_url[0];
          const tokenMatch = nextUrl.match(/page_token=([^&#]+)/);
          currentPageToken = tokenMatch
            ? decodeURIComponent(tokenMatch[1])
            : undefined;

          if (!currentPageToken) {
            break;
          }
        } else {
          break;
        }
      } else {
        return responseData as R;
      }

      currentPage++;
    }

    return allItems as R;
  }

  public async request<P extends keyof Paths>({
    path,
    method,
    params,
    version = "flags/v1",
    pages = 1,
  }: {
    path: P;
    version?: "flags/v1";
    method: Paths[P]["method"];
    params: Paths[P]["params"];
    pages?: number;
  }): Promise<Paths[P]["returnValue"]> {
    const result = await this.requestUntyped({
      path,
      method,
      version,
      params,
      pages,
    });
    return result as Paths[P]["returnValue"];
  }
}
