import { table } from "table";
import { Renderer } from "./renderer.ts";

export class TableRenderer extends Renderer {
  override async doRender<T extends object>(thing: T): Promise<void> {
    console.log({ theThing: thing })
    if (Array.isArray(thing)) {
      if (thing.length === 0) {
        console.log("Returned empty collection");
      } else if (typeof thing[0] === "object") {
        const headers = Object.keys(thing[0]);
        const rows = thing.map((row) => Object.values(row));

        console.log(table([headers, ...rows]));
      }
    } else if (typeof thing === "object") {
      console.log(table(Object.entries(thing)));
    }
  }
}
