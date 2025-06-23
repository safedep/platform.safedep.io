import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

function generateUniqueKeyName() {
  return `my-test-key-${randomUUID().slice(0, 8)}`;
}

function generateUniqueKeyDescription() {
  return `my-test-key-description-${randomUUID().slice(0, 8)}`;
}

test.describe.serial("API Key Management", () => {
  // Generate unique key name and description at the describe level
  const keyName = generateUniqueKeyName();
  const keyDescription = generateUniqueKeyDescription();

  test.beforeEach(async ({ page }) => {
    // select tenant
    await page.goto("/");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /default-team.*/ }).click();
  });

  test("create key", async ({ page }) => {
    // assert we are on keys page using its url
    await expect(page).toHaveURL("/keys");

    // create key
    await page.getByRole("link", { name: "Create New Key" }).click();
    await page.getByRole("textbox", { name: "Name" }).click();
    await page.getByRole("textbox", { name: "Name" }).fill(keyName);
    await page.getByRole("textbox", { name: "Description" }).click();
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(keyDescription);
    await page.getByRole("combobox", { name: "Expiry" }).click();
    await page.getByRole("option", { name: "90 days" }).click();
    await page.getByRole("button", { name: "Create" }).click();

    // assert api key created
    await expect(page.getByRole("main")).toContainText("API Key Created");
    await expect(page.getByRole("code")).toContainText(/default-team.*/);

    // show api key and assert api key is visible
    await page.getByRole("button", { name: "Show API key" }).click();
    await expect(page.getByRole("main")).toContainText(/sfd_*/);

    // go back to keys page
    await page.getByRole("button", { name: "Back" }).click();

    // assert key is in table
    await expect(page.locator("tbody")).toContainText(keyName);
    await expect(page.locator("tbody")).toContainText(keyDescription);
  });

  test("delete key", async ({ page }) => {
    // assert we are on keys page
    await expect(page).toHaveURL("/keys");

    // delete key
    await page
      .locator("tbody")
      .getByRole("row")
      .filter({ hasText: keyName })
      .getByRole("button")
      .click();
    await page.getByRole("menuitem", { name: "Delete Key" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    // assert key is not in table
    await expect(page.locator("tbody")).not.toContainText(keyName);
    await expect(page.locator("tbody")).not.toContainText(keyDescription);
  });
});
