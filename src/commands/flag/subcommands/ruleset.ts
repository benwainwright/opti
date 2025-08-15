import { globals } from "@core";
import { command, number, string } from "@drizzle-team/brocli";
import { OptimizelyClient } from "@optimizely-client";
import { createRenderer } from "@renderers";

export const getRuleset = command({
  name: "ruleset",
  options: {
    project_id: number("project_id").required(),
    flag_key: string("flag_key").required(),
    environment_key: string("environment_key").required(),
    ...globals,
  },
  handler: async (config) => {
    const client = new OptimizelyClient(config.token);
    const ruleset = await client.request({
      path: "projects/:project_id:/flags/:flag_key:/environments/:environment_key:/ruleset",
      method: "GET",
      params: {
        project_id: config.project_id,
        flag_key: config.flag_key,
        environment_key: config.environment_key,
      },
    });
    const renderer = createRenderer(config.renderer, [
      "environment_key",
      "flag_key",
      "project_id",
      "last_modified",
      "rules",
    ]);
    await renderer.render(ruleset, config.fields);
  },
});
