import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: ["./setupFiles.ts"],
    reporters:
      process.env.GITHUB_ACTIONS === "true"
        ? ["default", "github-actions"]
        : ["default"],
    coverage: {
      reporter: ["text", "json", "json-summary", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/(app)/api/**/*.{ts,tsx}",
        "src/components/ui/**/*.{ts,tsx}",
      ],
    },

    // For more info on projects, see: https://vitest.dev/guide/projects
    projects: [
      // unit tests
      {
        extends: true, // inherit from the base config
        test: {
          environment: "happy-dom",
          name: "unit",
          globals: true,
          restoreMocks: true,
          include: ["**/*.test.{ts,tsx}"],
        },
      },
    ],
  },
});
