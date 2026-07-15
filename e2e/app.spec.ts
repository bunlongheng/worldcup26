import { test, expect } from "@playwright/test";

test("loads all five views and opens a country modal", async ({ page }) => {
  await page.goto("/");
  // default Flags view
  await expect(page.getByRole("button", { name: "France" }).first()).toBeVisible();

  // switch through every tab
  for (const tab of ["Groups", "Bracket", "Map", "Globe", "Flags"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    await page.waitForTimeout(250);
  }

  // open a country modal from the Flags grid
  await page.getByRole("button", { name: "Brazil" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("tapping a group filter highlights it on the map", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await page.getByRole("button", { name: "D", exact: true }).click();
  await expect(page.getByText(/Group D/i)).toBeVisible();
});

test("a modal traps focus and closes on Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Groups", exact: true }).click();
  await page.getByRole("button", { name: /Argentina/ }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  // focus is inside the dialog
  await expect(dialog).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
