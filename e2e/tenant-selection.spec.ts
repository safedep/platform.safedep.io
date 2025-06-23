import { test, expect } from "@playwright/test";

test("select tenant", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: /default-team.*/ }).click();

  // Wait for navigation to complete after tenant selection
  await page.waitForURL("/keys");

  await expect(page.getByRole("main")).toContainText("Manage API Keys");
});
