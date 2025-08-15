import { vi } from "vitest";

let variable = 0;

export const runCli = async (args: string[]) => {

  vi.resetModules();

  process.argv = [
    'node', 'run', ...args
  ]

  await import(`../src/run.ts`);
};
