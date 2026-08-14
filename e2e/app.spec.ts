import { test, expect } from "@playwright/test";

test("loads all five views and opens a country modal", async ({ page }) => {
  await page.goto("/");
  // default Flags view
  await expect(page.getByRole("button", { name: "France" }).first()).toBeVisible();

  // Groups: standings table with points headers renders
  await page.getByRole("tab", { name: "Groups", exact: true }).click();
  await expect(page.getByText("GROUP A")).toBeVisible();
  await expect(page.getByRole("button", { name: /Mexico/ }).first()).toBeVisible();

  // Bracket: derived champion block renders and names Argentina (visible on all sizes)
  await page.getByRole("tab", { name: "Bracket", exact: true }).click();
  await expect(page.getByText("Crowned July 19")).toBeVisible();
  await expect(page.getByText("Argentina", { exact: true }).last()).toBeVisible();

  // Map + Globe: the interactive SVG renders
  await page.getByRole("tab", { name: "Map", exact: true }).click();
  await expect(page.getByRole("group", { name: /world map/i })).toBeVisible();
  await page.getByRole("tab", { name: "Globe", exact: true }).click();
  await expect(page.getByRole("group", { name: /globe/i })).toBeVisible();

  // back to Flags, open a country modal from the grid
  await page.getByRole("tab", { name: "Flags", exact: true }).click();
  await page.getByRole("button", { name: "Brazil" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("tapping a group filter highlights it on the map", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Map", exact: true }).click();
  await page.getByRole("button", { name: "Group D", exact: true }).click();
  await expect(page.getByText("GROUP D", { exact: true })).toBeVisible();
});

test("tablist is keyboard navigable with arrow keys", async ({ page }) => {
  await page.goto("/");
  const flags = page.getByRole("tab", { name: "Flags", exact: true });
  await flags.focus();
  await page.keyboard.press("ArrowRight");
  // focus + activation move to the next tab (Groups)
  await expect(page.getByRole("tab", { name: "Groups", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("GROUP A")).toBeVisible();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Globe", exact: true })).toHaveAttribute("aria-selected", "true");
});

test("a modal traps focus and closes on Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Groups", exact: true }).click();
  await page.getByRole("button", { name: /Argentina/ }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  // focus is inside the dialog
  await expect(dialog).toBeFocused();

  // Tab repeatedly and confirm focus is actually trapped (never escapes the dialog)
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const inside = await dialog.evaluate((d) => d.contains(document.activeElement));
    expect(inside).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
