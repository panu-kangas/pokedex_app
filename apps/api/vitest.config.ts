import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    // The first run downloads a MongoDB binary for mongodb-memory-server
    hookTimeout: 120_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // coverage.txt is posted to the CI job summary
      reporter: ['text', ['text', { file: 'coverage.txt' }], 'html'],
    },
  },
});
