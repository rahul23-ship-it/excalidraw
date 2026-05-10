import { defineConfig } from "@playwright/test";

const apiURL = process.env.E2E_API_URL || "http://localhost:3001";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: apiURL,
  },
  reporter: [["list"]],
});
