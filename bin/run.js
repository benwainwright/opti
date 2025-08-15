#!/usr/bin/env node

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entrypoint = join(__dirname, "..", "dist", "run.js");

const { default: run } = await import(entrypoint);

run();