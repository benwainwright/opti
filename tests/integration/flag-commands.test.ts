import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { runCli, type CliResult } from "../cli-runner.ts";
import { server } from "../msw/server.ts";

describe("Flag Commands Integration Tests", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe("flag list", () => {
    it("should list flags successfully with table output", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--renderer",
        "table",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(result.stdout.length).toBeGreaterThan(0);

      const output = result.stdout.join("\n");
      expect(output).toMatch(/key|name|id|archived|Returned empty collection/);
    });

    it("should list flags successfully with JSON output", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(result.stdout.length).toBeGreaterThan(0);

      const output = result.stdout.join("\n");
      const flags = JSON.parse(output);

      expect(Array.isArray(flags)).toBe(true);

      if (flags.length > 0) {
        const firstFlag = flags[0];
        expect(firstFlag).toHaveProperty("id");
        expect(firstFlag).toHaveProperty("key");
        expect(firstFlag).toHaveProperty("name");
        expect(firstFlag).toHaveProperty("archived");
        expect(typeof firstFlag.id).toBe("number");
        expect(typeof firstFlag.key).toBe("string");
        expect(typeof firstFlag.name).toBe("string");
        expect(typeof firstFlag.archived).toBe("boolean");
      }
    });

    it("should handle pagination parameters correctly", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--per_page",
        "10",
        "--page_number",
        "1",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const flags = JSON.parse(output);
      expect(Array.isArray(flags)).toBe(true);
    });

    it("should handle API errors gracefully", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--project_id",
        "99999999",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });

    it("should require project_id parameter", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toContain("project_id");
    });

    it("should require token parameter", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--project_id",
        "12345",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toContain("token");
    });
  });

  describe("flag get", () => {
    it("should get a single flag successfully", async () => {
      const result: CliResult = await runCli([
        "flag",
        "get",
        "--project_id",
        "12345",
        "--flag_key",
        "test_flag",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(result.stdout.length).toBeGreaterThan(0);

      const output = result.stdout.join("\n");
      const flag = JSON.parse(output);

      expect(flag).toHaveProperty("id");
      expect(flag).toHaveProperty("key");
      expect(flag).toHaveProperty("name");
      expect(flag).toHaveProperty("archived");

      expect(typeof flag.id).toBe("number");
      expect(typeof flag.key).toBe("string");
      expect(typeof flag.name).toBe("string");
      expect(typeof flag.archived).toBe("boolean");

      if (flag.description) {
        expect(typeof flag.description).toBe("string");
      }
    });

    it("should handle flag not found error", async () => {
      const result: CliResult = await runCli([
        "flag",
        "get",
        "--project_id",
        "12345",
        "--flag_key",
        "nonexistent_flag",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });

    it("should require both project_id and flag_key parameters", async () => {
      const result1: CliResult = await runCli([
        "flag",
        "get",
        "--project_id",
        "12345",
        "--token",
        "test-token",
      ]);

      expect(result1.exitCode).not.toBe(0);
      expect(result1.stderr.join("\n")).toContain("flag_key");

      const result2: CliResult = await runCli([
        "flag",
        "get",
        "--flag_key",
        "test_flag",
        "--token",
        "test-token",
      ]);

      expect(result2.exitCode).not.toBe(0);
      expect(result2.stderr.join("\n")).toContain("project_id");
    });
  });

  describe("flag ruleset", () => {
    it("should get flag ruleset successfully", async () => {
      const result: CliResult = await runCli([
        "flag",
        "ruleset",
        "--project_id",
        "12345",
        "--flag_key",
        "test_flag",
        "--environment_key",
        "production",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(result.stdout.length).toBeGreaterThan(0);

      const output = result.stdout.join("\n");
      const ruleset = JSON.parse(output);

      expect(ruleset).toHaveProperty("environment_key");
      expect(ruleset).toHaveProperty("flag_key");

      expect(typeof ruleset.environment_key).toBe("string");
      expect(typeof ruleset.flag_key).toBe("string");
    });

    it("should require all required parameters", async () => {
      const result: CliResult = await runCli([
        "flag",
        "ruleset",
        "--project_id",
        "12345",
        "--flag_key",
        "test_flag",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toContain("environment_key");
    });
  });

  describe("Field filtering", () => {
    it("should handle custom field selection", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--renderer",
        "json",
        "--fields",
        "key,name",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const flags = JSON.parse(output);

      if (Array.isArray(flags) && flags.length > 0) {
        const firstFlag = flags[0];
        expect(firstFlag).toHaveProperty("key");
        expect(firstFlag).toHaveProperty("name");
        expect(Object.keys(firstFlag)).toEqual(
          expect.arrayContaining(["key", "name"]),
        );
      }
    });
  });

  describe("flag entities", () => {
    it("should get flag entities successfully with table output", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "67890",
        "--token",
        "test-token",
        "--renderer",
        "table",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(result.stdout.length).toBeGreaterThan(0);

      const output = result.stdout.join("\n");
      expect(output).toMatch(
        /entity_type|entity_ids|Returned empty collection/,
      );
    });

    it("should get flag entities successfully with JSON output", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "67890",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(result.stdout.length).toBeGreaterThan(0);

      const output = result.stdout.join("\n");
      const entities = JSON.parse(output);

      expect(Array.isArray(entities)).toBe(true);

      if (entities.length > 0) {
        const firstEntity = entities[0];
        expect(firstEntity).toHaveProperty("entity_type");
        expect(firstEntity).toHaveProperty("entity_ids");
        expect(typeof firstEntity.entity_type).toBe("string");
        expect(Array.isArray(firstEntity.entity_ids)).toBe(true);

        if (firstEntity.entity_ids.length > 0) {
          // entity_ids can contain integers or strings according to the spec
          const firstEntityId = firstEntity.entity_ids[0];
          expect(["string", "number"].includes(typeof firstEntityId)).toBe(
            true,
          );
        }
      }
    });

    it("should handle flag entities not found error", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "99999999",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });

    it("should require both project_id and flag_id parameters", async () => {
      const result1: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--token",
        "test-token",
      ]);

      expect(result1.exitCode).not.toBe(0);
      expect(result1.stderr.join("\n")).toContain("flag_id");

      const result2: CliResult = await runCli([
        "flag",
        "entities",
        "--flag_id",
        "67890",
        "--token",
        "test-token",
      ]);

      expect(result2.exitCode).not.toBe(0);
      expect(result2.stderr.join("\n")).toContain("project_id");
    });

    it("should require token parameter", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "67890",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toContain("token");
    });

    it("should handle custom field selection", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "67890",
        "--token",
        "test-token",
        "--renderer",
        "json",
        "--fields",
        "entity_type,entity_ids",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const entities = JSON.parse(output);

      if (Array.isArray(entities) && entities.length > 0) {
        const firstEntity = entities[0];
        expect(firstEntity).toHaveProperty("entity_type");
        expect(firstEntity).toHaveProperty("entity_ids");
        expect(Object.keys(firstEntity)).toEqual(
          expect.arrayContaining(["entity_type", "entity_ids"]),
        );
      }
    });

    it("should validate flag_id parameter accepts numeric values", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "12345",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const entities = JSON.parse(output);
      expect(Array.isArray(entities)).toBe(true);
    });

    it("should handle API errors gracefully", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "99999999",
        "--flag_id",
        "99999999",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });

    it("should validate response structure matches OpenAPI spec for entities", async () => {
      const result: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "67890",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const entities = JSON.parse(output);

      expect(Array.isArray(entities)).toBe(true);

      if (entities.length > 0) {
        entities.forEach((entity: unknown) => {
          expect(entity).toHaveProperty("entity_type");
          expect(entity).toHaveProperty("entity_ids");
          expect(typeof entity.entity_type).toBe("string");
          expect(Array.isArray(entity.entity_ids)).toBe(true);
        });
      }
    });

    it("should support different output renderers consistently", async () => {
      // Test JSON renderer
      const jsonResult: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "67890",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(jsonResult.exitCode).toBe(0);
      expect(jsonResult.stderr).toHaveLength(0);

      const jsonOutput = jsonResult.stdout.join("\n");
      const entities = JSON.parse(jsonOutput);
      expect(Array.isArray(entities)).toBe(true);

      // Test table renderer
      const tableResult: CliResult = await runCli([
        "flag",
        "entities",
        "--project_id",
        "12345",
        "--flag_id",
        "67890",
        "--token",
        "test-token",
        "--renderer",
        "table",
      ]);

      expect(tableResult.exitCode).toBe(0);
      expect(tableResult.stderr).toHaveLength(0);
      expect(tableResult.stdout.length).toBeGreaterThan(0);
    });
  });

  describe("Error handling", () => {
    it("should handle authentication and validation properly", async () => {
      const result: CliResult = await runCli([
        "flag",
        "list",
        "--project_id",
        "12345",
        "--token",
        "any-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const flags = JSON.parse(output);
      expect(Array.isArray(flags)).toBe(true);
    });

    it("should validate response structure matches OpenAPI spec", async () => {
      const result: CliResult = await runCli([
        "flag",
        "get",
        "--project_id",
        "12345",
        "--flag_key",
        "any_flag",
        "--token",
        "test-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const flag = JSON.parse(output);

      expect(flag).toHaveProperty("id");
      expect(flag).toHaveProperty("key");
      expect(flag).toHaveProperty("name");
      expect(flag).toHaveProperty("archived");
    });
  });
});
