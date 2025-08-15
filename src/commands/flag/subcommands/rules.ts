import { globals } from "@core";
import { command, number, string } from "@drizzle-team/brocli";
import { OptimizelyClient } from "@optimizely-client";
import { createRenderer } from "@renderers";

export const listRules = command({
  name: "rules",
  options: {
    project_id: number("project_id").required(),
    flag_key: string("flag_key").required(),
    environment_key: string("environment_key").required(),
    page_number: number(),
    per_page: number(),
    ...globals,
  },
  handler: async (config) => {
    const client = new OptimizelyClient(config.token);
    const rules = await client.request({
      path: "projects/:project_id:/flags/:flag_key:/rulesets/:environment_key:/rules",
      method: "GET",
      params: {
        project_id: config.project_id,
        flag_key: config.flag_key,
        environment_key: config.environment_key,
        ...(config.page_number ? { page_number: config.page_number } : {}),
        ...(config.per_page ? { per_page: config.per_page } : {}),
      },
    });
    const renderer = createRenderer(config.renderer, [
      "id",
      "key",
      "type",
      "disabled",
    ]);
    await renderer.render(rules.items ?? [], config.fields);
  },
});
