export abstract class Renderer {
  public constructor(private defaultFields?: string[]) { }

  protected abstract doRender<T extends object>(thing: T): Promise<void>;

  private filterFields<T extends object>(thing: T, fields?: string[]) {
    if (!this.defaultFields) {
      return thing;
    }

    const theFields =
      typeof fields === "undefined" ? this.defaultFields : fields;

    return Object.fromEntries(
      Object.entries(thing).filter(([key]) => theFields.includes(key)),
    );
  }

  public async render<T extends object>(
    thing: T,
    fields?: string,
  ): Promise<void> {
    const theFields = fields?.split(",").map((item) => item.trim());
    if (Array.isArray(thing)) {
      if (thing.length === 0) {
        await this.doRender(thing);
      } else if (typeof thing[0] === "object") {
        await this.doRender(
          thing.map((item) => this.filterFields(item, theFields)),
        );
      }
    } else if (typeof thing === "object") {
      await this.doRender(this.filterFields(thing, theFields));
    } else {
      await this.doRender(thing);
    }
  }
}
