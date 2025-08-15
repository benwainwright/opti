import { globals } from "@core";
import { command, number, string, boolean } from "@drizzle-team/brocli";
import { OptimizelyClient } from "@optimizely-client";
import { createRenderer } from "@renderers";

export const listReports = command({
  name: "list",
  options: {
    project_id: number("project_id").required(),
    environment_key: string("environment_key").required(),
    per_page: number("per_page"),
    page_token: string("page_token"),
    page_window: number("page_window"),
    archived: boolean("archived"),
    filter: string("filter"),
    sort: string("sort"),
    query: string("query"),
    flag_key: string("flag_key"),
    type: string("type"),
    rule_state: string("rule_state"),
    start_date: string("start_date"),
    end_date: string("end_date"),
    ...globals,
  },
  handler: async (config) => {
    const client = new OptimizelyClient(config.token);
    const response = await client.request({
      path: "projects/:project_id:/environments/:environment_key:/reports",
      method: "GET",
      params: {
        project_id: config.project_id,
        environment_key: config.environment_key,
        ...(config.per_page ? { per_page: config.per_page } : {}),
        ...(config.page_token ? { page_token: config.page_token } : {}),
        ...(config.page_window ? { page_window: config.page_window } : {}),
        ...(config.archived !== undefined ? { archived: config.archived } : {}),
        ...(config.filter ? { filter: config.filter } : {}),
        ...(config.sort ? { sort: [config.sort] } : {}),
        ...(config.query ? { query: config.query } : {}),
        ...(config.flag_key ? { flag_key: config.flag_key } : {}),
        ...(config.type ? { type: config.type } : {}),
        ...(config.rule_state ? { rule_state: config.rule_state } : {}),
        ...(config.start_date ? { start_date: config.start_date } : {}),
        ...(config.end_date ? { end_date: config.end_date } : {}),
      },
      version: "flags/v1",
    });

    const renderer = createRenderer(config.renderer, [
      "key",
      "name",
      "id",
      "archived",
      "flag_key",
      "flag_name",
      "type",
      "created_time",
    ]);

    await renderer.render(response, config.fields);
  },
});
