import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  verbose: true,
  transformIgnorePatterns: [
    "node_modules/(?!(@buf)/)",
    "node_modules/(?!(@bufbuild)/)",
  ],
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
//export default createJestConfig(config);

// https://github.com/vercel/next.js/issues/36077
module.exports = async () => ({
  ...(await createJestConfig(config)()),
  transformIgnorePatterns: ["node_modules/(?!(@buf|@bufbuild|@bufbuild_es)/)"],
});
