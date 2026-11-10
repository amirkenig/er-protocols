import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: 0,
  reporter: "list",
  use: { baseURL: "http://localhost:4173/", trace: "off" },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
  webServer: {
    command: "npm run build && npm run preview",
    url: "http://localhost:4173/",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
