import { describe, it, expect, beforeEach } from "vitest";
import { Renderer } from "./renderer";

// Concrete test implementation of abstract Renderer class
class TestRenderer extends Renderer {
  public renderedData: unknown = null;

  protected async doRender<T extends object>(thing: T): Promise<void> {
    this.renderedData = thing;
  }

  public getRenderedData() {
    return this.renderedData;
  }
}

describe("Renderer", () => {
  let renderer: TestRenderer;

  const sampleObject = {
    id: "123",
    name: "test-object",
    description: "A test object",
    status: "active",
    metadata: { key: "value" },
  };

  const sampleArray = [
    { id: "1", name: "item1", category: "A" },
    { id: "2", name: "item2", category: "B" },
    { id: "3", name: "item3", category: "A" },
  ];

  describe("with default fields", () => {
    beforeEach(() => {
      renderer = new TestRenderer(["id", "name"]);
    });

    it("should filter object to default fields when no fields parameter provided", async () => {
      await renderer.render(sampleObject);

      expect(renderer.getRenderedData()).toEqual({
        id: "123",
        name: "test-object",
      });
    });

    it("should filter object to specified fields when fields parameter provided", async () => {
      await renderer.render(sampleObject, "name,description");

      expect(renderer.getRenderedData()).toEqual({
        name: "test-object",
        description: "A test object",
      });
    });

    it("should filter array elements to default fields when no fields parameter provided", async () => {
      await renderer.render(sampleArray);

      expect(renderer.getRenderedData()).toEqual([
        { id: "1", name: "item1" },
        { id: "2", name: "item2" },
        { id: "3", name: "item3" },
      ]);
    });

    it("should filter array elements to specified fields when fields parameter provided", async () => {
      await renderer.render(sampleArray, "id,category");

      expect(renderer.getRenderedData()).toEqual([
        { id: "1", category: "A" },
        { id: "2", category: "B" },
        { id: "3", category: "A" },
      ]);
    });

    it('should return unfiltered object when fields equals "all"', async () => {
      await renderer.render(sampleObject, "all");

      expect(renderer.getRenderedData()).toEqual(sampleObject);
    });

    it('should return unfiltered array when fields equals "all"', async () => {
      await renderer.render(sampleArray, "all");

      expect(renderer.getRenderedData()).toEqual(sampleArray);
    });

    it("should handle empty array regardless of fields parameter", async () => {
      const emptyArray: unknown[] = [];
      await renderer.render(emptyArray, "id,name");

      expect(renderer.getRenderedData()).toEqual([]);
    });

    it("should handle fields with whitespace correctly", async () => {
      await renderer.render(sampleObject, " name , description ");

      expect(renderer.getRenderedData()).toEqual({
        name: "test-object",
        description: "A test object",
      });
    });

    it("should handle non-existent fields gracefully", async () => {
      await renderer.render(sampleObject, "nonexistent,name");

      expect(renderer.getRenderedData()).toEqual({
        name: "test-object",
      });
    });
  });

  describe("without default fields", () => {
    beforeEach(() => {
      renderer = new TestRenderer();
    });

    it("should return unfiltered object when no default fields and no fields parameter", async () => {
      await renderer.render(sampleObject);

      expect(renderer.getRenderedData()).toEqual(sampleObject);
    });

    it("should filter object to specified fields when fields parameter provided", async () => {
      await renderer.render(sampleObject, "id,status");

      expect(renderer.getRenderedData()).toEqual({
        id: "123",
        status: "active",
      });
    });

    it('should return unfiltered object when fields equals "all"', async () => {
      await renderer.render(sampleObject, "all");

      expect(renderer.getRenderedData()).toEqual(sampleObject);
    });

    it("should return unfiltered array when no default fields and no fields parameter", async () => {
      await renderer.render(sampleArray);

      expect(renderer.getRenderedData()).toEqual(sampleArray);
    });

    it('should return unfiltered array when fields equals "all"', async () => {
      await renderer.render(sampleArray, "all");

      expect(renderer.getRenderedData()).toEqual(sampleArray);
    });
  });

  describe("edge cases", () => {
    beforeEach(() => {
      renderer = new TestRenderer(["id", "name"]);
    });

    it("should handle primitive values passed as objects", async () => {
      const primitiveAsObject = "not an object" as unknown;
      await renderer.render(primitiveAsObject);

      expect(renderer.getRenderedData()).toBe(primitiveAsObject);
    });

    it("should handle null values", async () => {
      const nullValue = null as unknown;
      await renderer.render(nullValue);

      expect(renderer.getRenderedData()).toBe(null);
    });

    it("should handle array with primitive elements", async () => {
      const primitiveArray = ["string1", "string2"] as unknown;
      await renderer.render(primitiveArray);

      expect(renderer.getRenderedData()).toEqual(primitiveArray);
    });

    it("should handle mixed array with objects and primitives", async () => {
      const mixedArray = [{ id: "1", name: "item1" }, "primitive"] as unknown;
      await renderer.render(mixedArray, "id");

      expect(renderer.getRenderedData()).toEqual([{ id: "1" }, "primitive"]);
    });

    it("should handle empty string as fields parameter", async () => {
      await renderer.render(sampleObject, "");

      expect(renderer.getRenderedData()).toEqual({});
    });

    it("should handle single field without comma", async () => {
      await renderer.render(sampleObject, "name");

      expect(renderer.getRenderedData()).toEqual({
        name: "test-object",
      });
    });

    it('should handle "all" with extra whitespace', async () => {
      await renderer.render(sampleObject, " all ");

      expect(renderer.getRenderedData()).toEqual(sampleObject);
    });

    it('should treat "all" case-sensitively', async () => {
      await renderer.render(sampleObject, "ALL");

      expect(renderer.getRenderedData()).toEqual({});
    });

    it('should handle "all" mixed with other fields', async () => {
      await renderer.render(sampleObject, "all,name");

      expect(renderer.getRenderedData()).toEqual(sampleObject);
    });
  });

  describe("complex data structures", () => {
    beforeEach(() => {
      renderer = new TestRenderer(["id", "data"]);
    });

    it('should preserve nested objects when fields equals "all"', async () => {
      const complexObject = {
        id: "123",
        data: {
          nested: {
            deeply: {
              value: "test",
            },
          },
          array: [1, 2, 3],
        },
        metadata: {
          created: "2023-01-01",
          updated: "2023-12-31",
        },
      };

      await renderer.render(complexObject, "all");

      expect(renderer.getRenderedData()).toEqual(complexObject);
    });

    it('should preserve nested objects in arrays when fields equals "all"', async () => {
      const complexArray = [
        {
          id: "1",
          config: {
            settings: { theme: "dark" },
            permissions: ["read", "write"],
          },
        },
        {
          id: "2",
          config: {
            settings: { theme: "light" },
            permissions: ["read"],
          },
        },
      ];

      await renderer.render(complexArray, "all");

      expect(renderer.getRenderedData()).toEqual(complexArray);
    });
  });
});
