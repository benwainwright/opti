export abstract class Renderer {
  public constructor(private defaultFields?: string[]) {}

  protected abstract doRender<T extends object>(thing: T): Promise<void>;

  private filterFields<T extends object>(thing: T, fields?: string[]) {
    if (!thing || typeof thing !== "object") {
      return thing;
    }

    const theFields =
      typeof fields === "undefined" ? this.defaultFields : fields;

    if (!theFields || theFields.includes("all")) {
      return thing;
    }

    return Object.fromEntries(
      Object.entries(thing).filter(([key]) => theFields.includes(key)),
    ) as T;
  }

  public async render<T extends object>(
    thing: T,
    fields?: string,
  ): Promise<void> {
    const theFields = fields?.split(",").map((item) => item.trim());

    if (Array.isArray(thing)) {
      if (thing.length === 0) {
        await this.doRender(thing);
      } else {
        await this.doRender(
          thing.map((item) => this.filterFields(item, theFields)),
        );
      }
    } else if (typeof thing === "object" && thing !== null) {
      await this.doRender(this.filterFields(thing, theFields));
    } else {
      await this.doRender(thing);
    }
  }
}
