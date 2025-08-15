import { string } from "@drizzle-team/brocli";
import { rendererNames } from "./renderer-names.ts";

export const globals = {
  token: string("token").desc("Optimizely API token").required(),
  fields: string("fields").desc("Fields to include from response"),
  renderer: string("renderer")
    .desc("Renderer to use")
    .enum(...rendererNames)
    .default("table"),
};
