import { rendererNames } from "@core";
import { Renderer } from "./renderer.ts";
import { TableRenderer } from "./table-renderer.ts";
import { JsonRenderer } from "./json-renderer.ts";

export const createRenderer = (
  renderer: (typeof rendererNames)[number],
  defaultFields?: string[],
): Renderer => {
  switch (renderer) {
    case "table":
      return new TableRenderer(defaultFields);
    case "json":
      return new JsonRenderer(defaultFields);
    default:
      throw new Error("Renderer not found");
  }
};
