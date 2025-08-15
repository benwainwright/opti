import { describe, it, expect, vi } from "vitest";
import { OptimizelyClient } from "./client.ts";

// Mock global fetch
const globalAny = global as typeof global & { fetch?: unknown };

describe("OptimizelyClient flags API", () => {
  it("builds correct URL for listing flags", async () => {
    const collected: string[] = [];
    globalAny.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      collected.push(url);
      return { ok: true, json: async () => ({ items: [] }) } as Response;
    });

    const client = new OptimizelyClient("TOKEN");
    await client.request({
      path: "projects/:project_id:/flags",
      method: "GET",
      params: { project_id: 123, per_page: 50 },
    });

    expect(collected[0]).toBe(
      "https://api.optimizely.com/flags/v1/projects/123/flags?per_page=50",
    );
  });

  it("builds correct URL for get flag", async () => {
    const collected: string[] = [];
    globalAny.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      collected.push(url);
      return {
        ok: true,
        json: async () => ({ id: 1, key: "flag", project_id: 123 }),
      } as Response;
    });

    const client = new OptimizelyClient("TOKEN");
    await client.request({
      path: "projects/:project_id:/flags/:flag_key:",
      method: "GET",
      params: { project_id: 123, flag_key: "my_flag" },
    });

    expect(collected[0]).toBe(
      "https://api.optimizely.com/flags/v1/projects/123/flags/my_flag",
    );
  });

  it("builds correct URL for get ruleset", async () => {
    const collected: string[] = [];
    globalAny.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      collected.push(url);
      return {
        ok: true,
        json: async () => ({
          environment_key: "prod",
          flag_key: "my_flag",
          project_id: 123,
          rules: [],
        }),
      } as Response;
    });

    const client = new OptimizelyClient("TOKEN");
    await client.request({
      path: "projects/:project_id:/flags/:flag_key:/environments/:environment_key:/ruleset",
      method: "GET",
      params: { project_id: 123, flag_key: "my_flag", environment_key: "prod" },
    });

    expect(collected[0]).toBe(
      "https://api.optimizely.com/flags/v1/projects/123/flags/my_flag/environments/prod/ruleset",
    );
  });

  it("builds correct URL for flag entities", async () => {
    const collected: string[] = [];
    globalAny.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      collected.push(url);
      return { ok: true, json: async () => ({ items: [] }) } as Response;
    });

    const client = new OptimizelyClient("TOKEN");
    await client.request({
      path: "projects/:project_id:/flags/:flag_id:/entities",
      method: "GET",
      params: {
        project_id: 123,
        flag_id: 456,
      },
    });

    expect(collected[0]).toBe(
      "https://api.optimizely.com/flags/v1/projects/123/flags/456/entities",
    );
  });

  it("builds correct URL for reports", async () => {
    const collected: string[] = [];
    globalAny.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      collected.push(url);
      return { ok: true, json: async () => ({ items: [] }) } as Response;
    });

    const client = new OptimizelyClient("TOKEN");
    await client.request({
      path: "projects/:project_id:/environments/:environment_key:/reports",
      method: "GET",
      params: { project_id: 123, environment_key: "prod" },
    });

    expect(collected[0]).toBe(
      "https://api.optimizely.com/flags/v1/projects/123/environments/prod/reports",
    );
  });
});
