import { globals } from "@core";
import { command, number } from "@drizzle-team/brocli";
import { OptimizelyClient } from "@optimizely-client";
import { createRenderer } from "@renderers";

export const getEntities = command({
  name: "entities",
  options: {
    project_id: number("project_id").required(),
    flag_id: number("flag_id").required(),
    ...globals,
  },
  handler: async (config) => {
    const client = new OptimizelyClient(config.token);
    const response = await client.request({
      path: "projects/:project_id:/flags/:flag_id:/entities",
      method: "GET",
      params: {
        project_id: config.project_id,
        flag_id: config.flag_id,
      },
      version: "flags/v1",
    });

    const renderer = createRenderer(config.renderer, [
      "entity_type",
      "entity_ids",
    ]);

    await renderer.render(response, config.fields);
  },
});