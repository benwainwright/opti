import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        plugins: [tsconfigPaths()],
        test: {
          include: ['src/**/*.spec.ts'],
          name: { label: 'unit', color: 'blue' },
          environment: 'node',
          globals: true,
          setupFiles: []
        }
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          include: ['tests/integration/**/*.test.ts'],
          name: { label: 'integration', color: 'green' },
          environment: 'node',
          globals: true
        }
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          include: ['tests/e2e/**/*.test.ts'],
          name: { label: 'e2e', color: 'yellow' },
          environment: 'node',
          globals: true
        }
      }
    ]
  }
})