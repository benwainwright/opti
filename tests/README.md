# Optimizely CLI Testing Guide

This directory contains comprehensive tests for the Optimizely CLI application, including both integration tests with mocked APIs and end-to-end tests against the real Optimizely API.

## Test Structure

```
tests/
├── integration/           # Integration tests with MSW mocking
│   └── flag-commands.test.ts
├── e2e/                  # End-to-end tests with real API
│   └── smoke.test.ts
├── msw/                  # Mock Service Worker setup
│   ├── handlers.ts       # API mock handlers
│   └── server.ts         # MSW server setup
├── helpers.ts            # Test utilities
└── README.md             # This file
```

## Integration Tests

Integration tests use Mock Service Worker (MSW) to mock Optimizely API responses based on the OpenAPI specification. These tests are fast, deterministic, and don't require network access.

### Running Integration Tests

```bash
# Run all tests (includes integration tests)
pnpm test

# Run only integration tests
pnpm test tests/integration/

# Run integration tests in watch mode
pnpm test:watch tests/integration/

# Run a specific integration test file
pnpm test tests/integration/flag-commands.test.ts
```

### What Integration Tests Cover

- **Flag Commands**:
  - ✅ `flag list` - Full testing with MSW mocking
  - ✅ `flag get` - Full testing with MSW mocking
  - ✅ `flag ruleset` - Full testing with MSW mocking
  - ⚠️ `flag rules` - Endpoint not in OpenAPI spec, tests error handling
  - ⚠️ `flag changes` - Endpoint not in OpenAPI spec, tests error handling
- **Parameter Validation**: Required and optional parameters
- **Output Formats**: Both JSON and table renderers
- **Error Handling**: API errors, network errors, validation errors, missing endpoints
- **Pagination**: Page number, page size, and query parameters
- **Field Filtering**: Custom field selection

#### Notes on Missing Endpoints

Some CLI commands use endpoints that are not present in the current OpenAPI specification:

- `GET /projects/{project_id}/flags/{flag_key}/rulesets/{environment_key}/rules` (used by `flag rules`)
- `GET /projects/{project_id}/flags/{flag_key}/changes` (used by `flag changes`)

These endpoints return HTML 404 pages instead of JSON, causing JSON parsing errors. The integration tests validate that these commands fail gracefully with appropriate error messages.

## End-to-End (E2E) Smoke Tests

E2E tests run against the real Optimizely API and validate the complete user journey from CLI invocation to API response processing.

### Prerequisites for E2E Tests

1. **API Token**: You need a valid Optimizely API token
2. **Test Data**: Ideally, have at least one project with some flags in your Optimizely account
3. **Network Access**: Tests require internet connectivity to reach Optimizely's API

### Setting Up E2E Tests

#### Option 1: Environment Variable

```bash
export OPTIMIZELY_API_TOKEN="your_api_token_here"
pnpm test tests/e2e/smoke.test.ts
```

#### Option 2: .env File (Recommended)

Create a `.env` file in the project root:

```
OPTIMIZELY_API_TOKEN=your_api_token_here
```

Then run:

```bash
pnpm test tests/e2e/smoke.test.ts
```

#### Option 3: One-time Run

```bash
OPTIMIZELY_API_TOKEN=your_token pnpm test tests/e2e/smoke.test.ts
```

### Getting Your API Token

1. Log into your Optimizely account
2. Go to Settings > Personal Access Tokens
3. Create a new token with appropriate permissions
4. Copy the token for use in tests

### What E2E Tests Cover

- **Help Commands**: Verify CLI help output
- **Authentication**: Valid and invalid token handling
- **Real Data**: Tests against your actual Optimizely data
- **Output Formats**: JSON and table format validation
- **Error Scenarios**: Non-existent projects, flags, etc.
- **Network Resilience**: Timeout and connection handling

### E2E Test Behavior

- **Graceful Skipping**: Tests are skipped if `OPTIMIZELY_API_TOKEN` is not available
- **Data Discovery**: Tests automatically discover available projects and flags
- **Error Tolerance**: Tests expect and handle missing test data gracefully
- **Informative Output**: Detailed console output explains what was tested

## Test Utilities

### `helpers.ts`

Provides the `runCli()` function for testing CLI commands:

```typescript
import { runCli } from "./helpers.ts";

const result = await runCli([
  "flag",
  "list",
  "--project_id",
  "12345",
  "--token",
  "test-token",
]);

// result.stdout: Array of stdout lines
// result.stderr: Array of stderr lines
// result.exitCode: Process exit code
```

## Mock Service Worker (MSW)

### `msw/handlers.ts`

Uses `@mswjs/source` to generate mock handlers from the OpenAPI specification:

```typescript
import { fromOpenApi } from "@mswjs/source/open-api";
import testSpec from "../../api.json" with { type: "json" };

export const handlers = await fromOpenApi(testSpec);
```

### `msw/server.ts`

Sets up the MSW server for Node.js testing:

```typescript
import { setupServer } from "msw/node";
import { handlers } from "./handlers.ts";

export const server = setupServer(...handlers);
```

## Running All Tests

```bash
# Run all tests (integration + any other tests)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage (if configured)
pnpm test --coverage

# Run tests with verbose output
pnpm test --reporter=verbose
```

## Test Configuration

Tests are configured in:

- `vitest.config.ts`: Vitest configuration
- `vitest.setup.ts`: Global test setup (MSW server)
- `package.json`: Test scripts

## CI/CD Considerations

### For Integration Tests

- ✅ Run in CI - no external dependencies
- ✅ Fast execution
- ✅ Deterministic results

### For E2E Tests

- ⚠️ Requires API token in CI environment
- ⚠️ Requires test data in Optimizely account
- ⚠️ Network dependency
- ⚠️ Slower execution

Consider running E2E tests:

- As a separate CI step
- Only on main branch or releases
- With dedicated test account and data

## Troubleshooting

### Integration Tests Failing

1. Check MSW handlers are properly set up
2. Verify API mock responses match expected format
3. Check test assertions match actual CLI output

### E2E Tests Skipping

1. Ensure `OPTIMIZELY_API_TOKEN` is set
2. Verify token has necessary permissions
3. Check network connectivity

### E2E Tests Failing

1. Verify token is valid and not expired
2. Ensure test data exists (projects, flags)
3. Check API rate limits
4. Review Optimizely API status

### CLI Output Issues

1. Verify renderer configuration
2. Check console output capturing in helpers
3. Review CLI argument format

## Contributing

When adding new tests:

1. **Integration Tests**: Add to `tests/integration/` with MSW mocking
2. **E2E Tests**: Add to `tests/e2e/` with real API calls
3. **Test Utilities**: Extend `helpers.ts` for common functionality
4. **Documentation**: Update this README for new test patterns

### Test Naming

- Integration tests: `*.test.ts` in `tests/integration/`
- E2E tests: `*.test.ts` in `tests/e2e/`
- Use descriptive test names that explain the behavior being tested
- Group related tests using `describe()` blocks

### Best Practices

- Keep integration tests fast and isolated
- Make E2E tests resilient to missing test data
- Use clear assertions and error messages
- Document any special test requirements
- Mock external dependencies in integration tests
- Use real APIs sparingly in E2E tests
