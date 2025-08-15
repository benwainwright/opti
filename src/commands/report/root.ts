import { command } from "@drizzle-team/brocli";
import { listReports } from "./subcommands/list.ts";
import { getReport } from "./subcommands/get.ts";

export const report = command({
  name: "report",
  subcommands: [listReports, getReport],
});
