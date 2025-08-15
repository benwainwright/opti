import { describe, it, expect, vi, afterAll, afterEach } from "vitest";
import { runCli } from "../helpers.ts";


const consoleMock = vi.spyOn(console, 'log')

afterEach(() => {
  consoleMock.mockReset();
});


describe("flag CLI integration (msw)", () => {
  it("lists flags", async () => {

    await runCli([
      "flag",
      "list",
      "--token",
      "TEST",
      "--project_id",
      "12345",
    ]);

    await vi.waitFor(() => {
      expect(consoleMock).toHaveBeenLastCalledWith('flag_one');
    })
  });

  // it("gets a flag", async () => {
  //   const out = await runCli([
  //     "flag",
  //     "get",
  //     "--token",
  //     "TEST",
  //     "--project_id",
  //     "123",
  //     "--flag_key",
  //     "flag_one",
  //   ]);
  //   expect(out).toContain("flag_one");
  //   expect(out).toContain("Mock Flag");
  // });
  //
  // it("gets ruleset", async () => {
  //   const out = await runCli([
  //     "flag",
  //     "ruleset",
  //     "--token",
  //     "TEST",
  //     "--project_id",
  //     "123",
  //     "--flag_key",
  //     "flag_one",
  //     "--environment_key",
  //     "prod",
  //   ]);
  //   expect(out).toContain("prod");
  //   expect(out).toContain("flag_one");
  // });
  //
  // it("lists rules", async () => {
  //   const out = await runCli([
  //     "flag",
  //     "rules",
  //     "--token",
  //     "TEST",
  //     "--project_id",
  //     "123",
  //     "--flag_key",
  //     "flag_one",
  //     "--environment_key",
  //     "prod",
  //   ]);
  //   expect(out).toContain("rule_a");
  // });

  //   it("lists changes", async () => {
  //     const out = await runCli([
  //       "flag",
  //       "changes",
  //       "--token",
  //       "TEST",
  //       "--project_id",
  //       "123",
  //       "--flag_key",
  //       "flag_one",
  //     ]);
  //     expect(out).toContain("updated description");
  //   });
});
