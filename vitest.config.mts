import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "happy-dom",
    globals: true,
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
  },
});
