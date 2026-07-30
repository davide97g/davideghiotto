import { defineConfig } from "vitest/config";

// Without this, vitest walks up and picks the portfolio's jsdom config (and its
// setup file, which doesn't exist here).
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
