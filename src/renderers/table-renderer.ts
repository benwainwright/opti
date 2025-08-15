import { table } from "table";
import { Renderer } from "./renderer.ts";

export class TableRenderer extends Renderer {
  override async doRender<T extends object>(thing: T): Promise<void> {
    if (Array.isArray(thing)) {
      if (thing.length === 0) {
        console.log("Returned empty collection");
      } else if (typeof thing[0] === "object" && thing[0] !== null) {
        const firstItem = thing[0] as Record<string, unknown>;
        const headers = Object.keys(firstItem);
        const rows = thing.map((row) => {
          if (typeof row === "object" && row !== null) {
            return Object.values(row as Record<string, unknown>);
          }
          return [row];
        });

        console.log(table([headers, ...rows]));
      }
    } else if (typeof thing === "object" && thing !== null) {
      console.log(table(Object.entries(thing as Record<string, unknown>)));
    }
  }
}
