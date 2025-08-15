# Optimizely CLI Project

## Overview

This is a TypeScript-based CLI tool for interacting with Optimizely's API, focusing on feature flag and project management.

## Project Structure

```
src/
├── commands/          # CLI command definitions
│   ├── flag/         # Feature flag commands
│   │   └── subcommands/
│   └── project/      # Project commands
├── core/             # Core utilities and globals
├── optimizely-client/ # API client implementation
│   └── optimizely-types/ # TypeScript type definitions
├── renderers/        # Output formatting (JSON, Table)
├── types/           # Additional type definitions
└── run.ts          # CLI entry point
```

## Tech Stack

- **Language**: TypeScript (ES modules)
- **CLI Framework**: @drizzle-team/brocli
- **Testing**: Vitest with MSW for API mocking
- **Package Manager**: pnpm
- **Build Tool**: Vite

## Available Commands

### Scripts

- `pnpm start` - Run the CLI
- `pnpm test:unit` - Run unit tests (*.spec.ts)
- `pnpm test:integration` - Run integration tests (tests/integration/*.test.ts - these stub out the API)
- `pnpm test:e2e` - Run end to end tests (within tests/e2e/*.test.ts - these test against real data)
- `pnpm test:watch` - Run tests in watch mode

### CLI Commands

- Flag management commands in `src/commands/flag/`
- Project management commands in `src/commands/project/`

## Key Files

- `src/run.ts` - Main CLI entry point
- `src/optimizely-client/client.ts` - Optimizely API client
- `api.json` - OpenAPI spec downloaded from the Optimizely website
- `tests/` - Test suite with integration tests

## Development Guidelines

- The project uses ES modules (`"type": "module"` in package.json)
- Tests use Vitest with MSW for mocking HTTP requests
- Output can be rendered as JSON or Table format via renderers
- Type definitions for Optimizely API responses are in `src/optimizely-client/optimizely-types/`

## Testing

- Unit tests: Located alongside source files (e.g., `client.test.ts`)
- Integration tests: Located in `tests/integration/`
- MSW handlers: Defined in `tests/msw/handlers.ts`

## Notes

- The project appears to be in active development
- Uses modern TypeScript features and tooling
- Follows modular architecture with clear separation of concerns

## Behavioural Rules

- YOU MUST write all code using a strict TDD based red/green refactor approach - delegate to the TypeScript tester agent to write the tests for the RED stage and the TypeScript pro agent to write the implementation (GREEN stage)
- Once code is written and the tests pass, always get the TypeScript pro agent to check over both the implementation and test code to do the REFACTOR stage
- YOU MUST always fix any diagnostics reported by the editor before proceeding to write new code
- Once a full feature is complete (e.g. a whole command), you MUST delegate to the integration tester to write integration tests. You can write smoke tests (tests that use the actual API without mocking, but you have to ask me first)
- YOU MUST NOT add comments to code for any reason other than 'NOOP' comments for empty blocks, eslint ignore comments, or TSDoc comments
- You MUST always concisely summarise these behavioural rules, along with any specified by your agent file before each response
