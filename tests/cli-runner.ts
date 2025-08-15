import { vi } from "vitest";
import { execa } from "execa";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "../");
const cliPath = join(projectRoot, "src/run.ts");

export interface CliResult {
  stdout: string[];
  stderr: string[];
  exitCode: number;
  success: boolean;
}

export interface CliRunnerOptions {
  mode?: "subprocess" | "in-process";
  timeout?: number;
  cwd?: string;
}

export const runCli = async (
  args: string[],
  options: CliRunnerOptions = {},
): Promise<CliResult> => {
  const { mode = "in-process", timeout = 30000, cwd = projectRoot } = options;

  if (mode === "subprocess") {
    return runCliSubprocess(args, { timeout, cwd });
  } else {
    return runCliInProcess(args);
  }
};

async function runCliSubprocess(
  args: string[],
  options: { timeout: number; cwd: string },
): Promise<CliResult> {
  try {
    const result = await execa("npx", ["vite-node", cliPath, ...args], {
      cwd: options.cwd,
      timeout: options.timeout,
    });
    return {
      stdout: result.stdout.split("\n").filter((line) => line.trim()),
      stderr: result.stderr.split("\n").filter((line) => line.trim()),
      exitCode: result.exitCode ?? 0,
      success: true,
    };
  } catch (error: unknown) {
    return {
      stdout: (error.stdout || "")
        .split("\n")
        .filter((line: string) => line.trim()),
      stderr: (error.stderr || error.message || "")
        .split("\n")
        .filter((line: string) => line.trim()),
      exitCode: error.exitCode || 1,
      success: false,
    };
  }
}

async function runCliInProcess(args: string[]): Promise<CliResult> {
  vi.resetModules();

  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalProcessExit = process.exit;

  const stdout: string[] = [];
  const stderr: string[] = [];
  let exitCode = 0;
  let success = true;

  console.log = vi.fn((...args) => {
    stdout.push(
      args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" "),
    );
  });

  console.error = vi.fn((...args) => {
    stderr.push(
      args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" "),
    );
  });

  process.exit = vi.fn((code?: number) => {
    exitCode = code || 0;
    success = exitCode === 0;
    throw new Error(`Process exit with code ${exitCode}`);
  }) as typeof process.exit;

  try {
    process.argv = ["node", "run", ...args];

    const { run } = await import("@drizzle-team/brocli");
    const { flag, environment, report } = await import("@commands");

    await run([flag, environment, report]);
  } catch (error) {
    if (!(error instanceof Error && error.message.includes("Process exit"))) {
      stderr.push(error instanceof Error ? error.message : String(error));
      exitCode = 1;
      success = false;
    }
  } finally {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.exit = originalProcessExit;
  }

  return { stdout, stderr, exitCode, success };
}
