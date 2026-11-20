import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // Rules are stateless: reusing workers across test files is safe and much faster
    isolate: false,
  },
});
