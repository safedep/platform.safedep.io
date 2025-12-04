import { test, expect } from "@playwright/test";

test.describe.parallel("package report page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/community/packages/ECOSYSTEM_NPM/next/15.5.3");
  });

  test("page header", async ({ page }) => {
    await expect(page.getByText("Powered by SafeDep")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Install GitHub App" }),
    ).toBeVisible();
    await expect(page.getByText("next@15.5.3")).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "Analysed at:" }),
    ).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "Source:" }),
    ).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "SHA256:" }),
    ).toBeVisible();
    await expect(
      page.locator("span").filter({ hasText: "Confidence:" }),
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
        .filter({ hasText: /^Version$/ })
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
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Ecosystem$/ })
        .first(),
    ).toBeVisible();
  });

  test("overview tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Overview" }).click();
    await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Verification Record" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Details" })).toBeVisible();
  });

  test("vulnerabilities tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Vulnerabilities" }).click();

    await expect(
      page.getByRole("cell", { name: "Vulnerability ID" }),
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "Summary" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Risk" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Published" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Modified" })).toBeVisible();
  });

  test("versions tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Versions" }).click();
    await expect(
      page.getByRole("cell", { name: "Version", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "Published" })).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "View Version" }).first(),
    ).toBeVisible();
  });

  test("license tab", async ({ page }) => {
    await page.getByRole("tab", { name: "Licenses" }).click();
    await expect(page.getByRole("cell", { name: "License ID" })).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "License Name" }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Reference URL" }),
    ).toBeVisible();
  });
});
