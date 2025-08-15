import { mapKeyValuePair, type ParamValue } from "./map-key-value-pair.ts";
import type { Paths } from "./paths.ts";

export class OptimizelyClient {
  public constructor(private token: string) { }

  public async requestUntyped<R extends unknown>({
    path,
    method,
    params,
    version = "flags/v1",
    pages = 1,
  }: {
    path: string;
    method: string;
    params: unknown;
    version?: "flags/v1";
    pages?: number;
  }) {
    const result = await Promise.all(
      Array.from({ length: pages }).map(async (_, page) => {
        const options = {
          method,
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        };

        const pathParamsRegexGlobal = /:([\w\-\_]+):/g;
        const pathParams = Array.from(path.matchAll(pathParamsRegexGlobal)).map(
          (m) => m[1]
        );

        const extractPathParams = Object.entries(
          params as Record<string, ParamValue>
        ).reduce<{
          path: string;
          params: Record<string, ParamValue>;
        }>(
          (accum, [key, value]) => {
            if (pathParams?.includes(key)) {
              return {
                path: accum.path.replaceAll(
                  new RegExp(`\:${key}\:`, "g"),
                  String(value)
                ),
                params: { ...accum.params },
              };
            }
            return {
              path: accum.path,
              params: { ...accum.params, [key]: value },
            };
          },
          { path, params: {} }
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
          const errorJson = (await result.json()) as {
            code: string;
            message: string;
          };

          throw new Error(
            `Returned statusCode ${result.status} with [${errorJson.code}] ${errorJson.message}`
          );
        }


        return (await result.json()) as R;
      })
    );

    return result.flat();
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
    return (await this.requestUntyped({
      path,
      method,
      version,
      params,
      pages,
    })) as Paths[P]["returnValue"];
  }
}
