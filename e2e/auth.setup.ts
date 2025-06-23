/**
 * Performs login as a user as provided by the environment variables and saves
 * the auth state to a file. This file is used by the tests to authenticate.
 */
import { env } from "./config/env";
import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/user.json");

setup("authenticate as user", async ({ page }) => {
  await page.goto("/auth/login");

  // fill email address
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill(env.E2E_USER_EMAIL);
  // fill password
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(env.E2E_USER_PASSWORD);
  // click continue
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  // wait for optional asking for consent
  if (page.url().includes("/consent")) {
    await page.getByRole("button", { name: "Accept" }).click();
  }

  // wait for navigation to complete
  await page.waitForURL("/");

  // save to user.json
  await page.context().storageState({ path: authFile });
});
