import { globals } from "@core";
import { command, number, string } from "@drizzle-team/brocli";
import { OptimizelyClient } from "@optimizely-client";
import { createRenderer } from "@renderers";

export const listFlags = command({
  name: "list",
  options: {
    project_id: number("project_id").required(),
    per_page: number(),
    page_number: number(),
    query: string(),
    ...globals,
  },
  handler: async (config) => {
    const client = new OptimizelyClient(config.token);
    const response = await client.request({
      path: "projects/:project_id:/flags",
      method: "GET",
      params: {
        project_id: config.project_id,
        ...(config.per_page ? { per_page: config.per_page } : {}),
        ...(config.page_number ? { page_number: config.page_number } : {}),
        ...(config.query ? { query: config.query } : {}),
      },
      version: "flags/v1",
    });

    const renderer = createRenderer(config.renderer, [
      "key",
      "id",
      "name",
      "archived",
    ]);

    console.log({ thing: response })

    await renderer.render(response.items ?? [], config.fields);
  },
});
