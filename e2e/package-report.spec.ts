import { test, expect } from "@playwright/test";

test.describe.parallel("package report page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/community/packages/ECOSYSTEM_NPM/next/15.5.3");
  });

  test("page header", async ({ page }) => {
    await expect(
      page.locator("div").filter({ hasText: /^next$/ }),
    ).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "15.5.3" }).first(),
    ).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "Source" }).first(),
    ).toBeVisible();
  });

  test("stats cards", async ({ page }) => {
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Vulnerabilities$/ })
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^OpenSSF Scorecard$/ })
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^License$/ })
        .first(),
    ).toBeVisible();
  });

  test("package analysis tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Package Analysis" }).click();
    await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Details" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Evidences" }),
    ).toBeVisible();
  });

  test("vulnerabilities tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Vulnerabilities" }).click();

    await expect(page.getByRole("cell", { name: "ID" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Summary" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Risk" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Published" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Modified" })).toBeVisible();
  });

  test("license tab", async ({ page }) => {
    await page.getByRole("tab", { name: "License" }).click();
    await expect(page.getByRole("cell", { name: "License ID" })).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "License Name" }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "OSI Approved" }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Commercial Use" }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Reference URL" }),
    ).toBeVisible();
  });
});
