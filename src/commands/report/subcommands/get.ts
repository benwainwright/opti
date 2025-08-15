import { globals } from "@core";
import { command, number, string } from "@drizzle-team/brocli";
import { OptimizelyClient } from "@optimizely-client";
import { createRenderer } from "@renderers";

export const getReport = command({
  name: "get",
  options: {
    project_id: number("project_id").required(),
    environment_key: string("environment_key").required(),
    report_key: string("report_key").required(),
    ...globals,
  },
  handler: async (config) => {
    const client = new OptimizelyClient(config.token);
    const report = await client.request({
      path: "projects/:project_id:/environments/:environment_key:/reports/:report_key:",
      method: "GET",
      params: {
        project_id: config.project_id,
        environment_key: config.environment_key,
        report_key: config.report_key,
      },
    });

    const renderer = createRenderer(config.renderer, [
      "id",
      "key",
      "name",
      "archived",
      "flag_key",
      "flag_name",
      "type",
      "created_time",
      "description",
      "start_time",
      "end_time",
    ]);

    await renderer.render(report, config.fields);
  },
});
