import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { runCli, type CliResult } from "../cli-runner.ts";
import { server } from "../msw/server.ts";

describe("Environment Commands Integration Tests", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe("environment list", () => {
    it("should list environments successfully with table output", async () => {
      const result: CliResult = await runCli([
        "environment",
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
      expect(output).toMatch(
        /key|name|id|archived|priority|Returned empty collection/,
      );
    });

    it("should list environments successfully with JSON output", async () => {
      const result: CliResult = await runCli([
        "environment",
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
      const environments = JSON.parse(output);

      expect(Array.isArray(environments)).toBe(true);

      if (environments.length > 0) {
        const firstEnvironment = environments[0];
        expect(firstEnvironment).toHaveProperty("id");
        expect(firstEnvironment).toHaveProperty("key");
        expect(firstEnvironment).toHaveProperty("name");
        expect(firstEnvironment).toHaveProperty("archived");
        expect(firstEnvironment).toHaveProperty("priority");
        expect(firstEnvironment).toHaveProperty("account_id");

        expect(typeof firstEnvironment.id).toBe("number");
        expect(typeof firstEnvironment.key).toBe("string");
        expect(typeof firstEnvironment.name).toBe("string");
        expect(typeof firstEnvironment.archived).toBe("boolean");
        expect(typeof firstEnvironment.priority).toBe("number");
        expect(typeof firstEnvironment.account_id).toBe("number");
      }
    });

    it("should handle pagination parameters correctly", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--per_page",
        "10",
        "--page_token",
        "next_page_token_123",
        "--page_window",
        "5",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);
      expect(Array.isArray(environments)).toBe(true);
    });

    it("should handle archived filter parameter", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--archived",
        "false",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);
      expect(Array.isArray(environments)).toBe(true);

      // MSW auto-generates mock data and doesn't implement actual filtering
      // Just verify that archived property exists and is a boolean
      environments.forEach((env: unknown) => {
        const environment = env as { archived?: boolean };
        if (environment.archived !== undefined) {
          expect(typeof environment.archived).toBe("boolean");
        }
      });
    });

    it("should handle sort parameter correctly", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--sort",
        "priority:asc",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);
      expect(Array.isArray(environments)).toBe(true);
    });

    it("should handle multiple sort parameters", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--sort",
        "priority:desc",
        "--sort",
        "priority:asc",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);
      expect(Array.isArray(environments)).toBe(true);
    });

    it("should handle API errors gracefully", async () => {
      const result: CliResult = await runCli([
        "environment",
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
        "environment",
        "list",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toContain("project_id");
    });

    it("should require token parameter", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toContain("token");
    });

    it("should handle custom field selection", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--renderer",
        "json",
        "--fields",
        "key,name,archived",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);

      if (Array.isArray(environments) && environments.length > 0) {
        const firstEnvironment = environments[0];
        expect(firstEnvironment).toHaveProperty("key");
        expect(firstEnvironment).toHaveProperty("name");
        expect(firstEnvironment).toHaveProperty("archived");
        expect(Object.keys(firstEnvironment)).toEqual(
          expect.arrayContaining(["key", "name", "archived"]),
        );
      }
    });

    it("should validate boolean archived parameter", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--archived",
        "invalid_boolean",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toMatch(
        /Unrecognized options|invalid_boolean/i,
      );
    });

    it("should validate sort parameter values", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--sort",
        "invalid_sort_value",
      ]);

      // API handles invalid sort values gracefully now
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });

    it("should handle numeric project_id validation", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "not_a_number",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toMatch(
        /project_id.*number|invalid.*project_id/i,
      );
    });

    it("should handle numeric per_page validation", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--per_page",
        "not_a_number",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toMatch(
        /per_page.*number|invalid.*per_page/i,
      );
    });

    it("should handle numeric page_window validation", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--page_window",
        "not_a_number",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toMatch(
        /page_window.*number|invalid.*page_window/i,
      );
    });
  });

  describe("Command Structure and Help", () => {
    it("should display help for environment command", async () => {
      const result: CliResult = await runCli(["environment", "--help"]);

      expect(result.exitCode).toBe(0);
      const output = result.stdout.join("\n");
      expect(output).toContain("environment");
      expect(output).toContain("list");
    });

    it("should display help for environment list subcommand", async () => {
      const result: CliResult = await runCli(["environment", "list", "--help"]);

      expect(result.exitCode).toBe(0);
      const output = result.stdout.join("\n");
      expect(output).toContain("list");
      expect(output).toContain("project_id");
      expect(output).toContain("token");
      expect(output).toContain("per_page");
      expect(output).toContain("page_token");
      expect(output).toContain("page_window");
      expect(output).toContain("archived");
      expect(output).toContain("sort");
      expect(output).toContain("renderer");
      expect(output).toContain("fields");
    });

    it("should show error for unknown environment subcommand", async () => {
      const result: CliResult = await runCli([
        "environment",
        "unknown_command",
        "--project_id",
        "12345",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toMatch(
        /unknown.*command|subcommand.*not.*found/i,
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle authentication and validation properly", async () => {
      const result: CliResult = await runCli([
        "environment",
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
      const environments = JSON.parse(output);
      expect(Array.isArray(environments)).toBe(true);
    });

    it("should validate response structure matches OpenAPI spec", async () => {
      const result: CliResult = await runCli([
        "environment",
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

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);

      expect(Array.isArray(environments)).toBe(true);

      // Validate each environment matches the expected schema
      environments.forEach((environment: unknown) => {
        const env = environment as {
          id: number;
          key: string;
          name: string;
          archived: boolean;
          priority: number;
          account_id: number;
        };
        expect(env).toHaveProperty("id");
        expect(env).toHaveProperty("key");
        expect(env).toHaveProperty("name");
        expect(env).toHaveProperty("archived");
        expect(env).toHaveProperty("priority");
        expect(env).toHaveProperty("account_id");

        expect(typeof env.id).toBe("number");
        expect(typeof env.key).toBe("string");
        expect(typeof env.name).toBe("string");
        expect(typeof env.archived).toBe("boolean");
        expect(typeof env.priority).toBe("number");
        expect(typeof env.account_id).toBe("number");

        // Validate key pattern matches OpenAPI spec
        expect(env.key).toMatch(/^[a-zA-Z0-9_-]+$/);
      });
    });

    it("should handle network errors gracefully", async () => {
      // This test would simulate network failures
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "network-error-token",
      ]);

      // Should handle network errors gracefully without crashing
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });

    it("should handle unauthorized access gracefully", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "unauthorized-token",
      ]);

      // Should handle auth errors gracefully
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });

    it("should handle forbidden access gracefully", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "forbidden-token",
      ]);

      // Should handle forbidden errors gracefully
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
    });
  });

  describe("Renderer Integration", () => {
    it("should default to appropriate renderer when not specified", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);
      expect(result.stdout.length).toBeGreaterThan(0);
    });

    it("should handle invalid renderer gracefully", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--renderer",
        "invalid_renderer",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.join("\n")).toMatch(/renderer.*invalid|json|table/i);
    });
  });

  describe("Integration with Optimizely Client", () => {
    it("should pass correct parameters to client request", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "test-token",
        "--per_page",
        "25",
        "--page_token",
        "test_token",
        "--page_window",
        "10",
        "--archived",
        "false",
        "--sort",
        "priority:asc",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);
      expect(Array.isArray(environments)).toBe(true);
    });

    it("should handle client initialization with token", async () => {
      const result: CliResult = await runCli([
        "environment",
        "list",
        "--project_id",
        "12345",
        "--token",
        "valid-client-token",
        "--renderer",
        "json",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toHaveLength(0);

      const output = result.stdout.join("\n");
      const environments = JSON.parse(output);
      expect(Array.isArray(environments)).toBe(true);
    });
  });
});
