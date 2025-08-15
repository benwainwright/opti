import { Renderer } from "./renderer.ts";

export class JsonRenderer extends Renderer {
  protected override async doRender<T extends object>(thing: T): Promise<void> {
    console.log(JSON.stringify(thing, null, 2));
  }
}
