import { server } from "./tests/msw/server.ts";
import { beforeAll, afterAll, afterEach } from "vitest";

beforeAll(() => {
  server.listen();
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
