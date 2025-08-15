import { globals } from "@core";
import { boolean, command, number, string } from "@drizzle-team/brocli";
import { OptimizelyClient } from "@optimizely-client";
import { createRenderer } from "@renderers";

export const listEnvironments = command({
  name: "list",
  options: {
    project_id: number("project_id").desc("Project ID").required(),
    per_page: number("per_page").desc("Number of items per page"),
    page_token: string("page_token").desc("Token for pagination"),
    page_window: number("page_window").desc("Page window size"),
    archived: boolean("archived").desc("Filter by archived status"),
    sort: string("sort").desc("Sort order (priority:asc or priority:desc)"),
    ...globals,
  },
  handler: async (config) => {
    const client = new OptimizelyClient(config.token);
    const response = await client.request({
      path: "projects/:project_id:/environments",
      method: "GET",
      params: {
        project_id: config.project_id,
        ...(config.per_page ? { per_page: config.per_page } : {}),
        ...(config.page_token ? { page_token: config.page_token } : {}),
        ...(config.page_window ? { page_window: config.page_window } : {}),
        ...(config.archived !== undefined ? { archived: config.archived } : {}),
        ...(config.sort ? { sort: [config.sort] } : {}),
      },
      version: "flags/v1",
    });

    const renderer = createRenderer(config.renderer, [
      "key",
      "id", 
      "name",
      "archived",
      "priority",
      "account_id",
    ]);

    await renderer.render(response, config.fields);
  },
});