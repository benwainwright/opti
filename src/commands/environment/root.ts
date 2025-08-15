import { command } from "@drizzle-team/brocli";
import { listEnvironments } from "./subcommands/list.ts";

export const environment = command({
  name: "environment",
  subcommands: [listEnvironments],
});