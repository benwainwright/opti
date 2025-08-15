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
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

### CLI Commands
- Flag management commands in `src/commands/flag/`
- Project management commands in `src/commands/project/`

## Key Files
- `src/run.ts` - Main CLI entry point
- `src/optimizely-client/client.ts` - Optimizely API client
- `api.json` & `flags-api-reference.json` - API reference files
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