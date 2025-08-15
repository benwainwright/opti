import { command } from "@drizzle-team/brocli";
import { listFlags } from "./subcommands/list.ts";
import { getFlag } from "./subcommands/get.ts";
import { getRuleset } from "./subcommands/ruleset.ts";
import { listRules } from "./subcommands/rules.ts";
import { listChanges } from "./subcommands/changes.ts";

export const flag = command({
  name: "flag",
  subcommands: [listFlags, getFlag, getRuleset, listRules, listChanges],
});
