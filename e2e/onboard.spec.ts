import { expect, test } from "@playwright/test";
import { randomUUID } from "crypto";

function generateUniqueOrgDomain() {
  return `my-test-org-${randomUUID().slice(0, 8)}.com`;
}

test("perform onboarding", async ({ page }) => {
  test.skip(true);
  await page.goto("/");

  // expect title to contain "Choose your tenant"
  await expect(page).toHaveTitle("Onboarding | SafeDep Platform");

  // wait for tenant selector to be visible
  await expect(page.getByText("Create Your Organization")).toBeVisible();

  // fill in user name
  await page.getByRole("textbox", { name: "Name", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Test User");

  // fill in organization name
  await page.getByRole("textbox", { name: "Organization Name" }).click();
  await page
    .getByRole("textbox", { name: "Organization Name" })
    .fill("My test organization");

  // fill in organization domain
  await page.getByRole("textbox", { name: "Organization Domain" }).click();
  await page
    .getByRole("textbox", { name: "Organization Domain" })
    .fill(generateUniqueOrgDomain());

  // click create organization
  await page.getByRole("button", { name: "Create Organization" }).click();
  await page.getByRole("combobox").click();
  await page
    .getByRole("option", { name: /default-team.*/ }) // TODO: click the first option
    .click();

  // page should now navigate. Assert page is in /dashboard
  await expect(page).toHaveURL("/keys");
});
