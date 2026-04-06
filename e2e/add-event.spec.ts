import { test, expect } from "@playwright/test";

test("user can add an event and see it on the day page", async ({ page }) => {
  await page.goto("/add");

  await expect(page.getByRole("heading", { name: "Add Event" })).toBeVisible();

  await page.getByLabel("Event Title").fill("Team standup");
  await page.getByLabel("Date").fill("2026-06-15");
  await page.getByLabel("Start Time").fill("09:00");
  await page.getByLabel("End Time").fill("09:30");
  await page.getByLabel("Category").selectOption("work");
  await page.getByLabel("Description").fill("Daily sync meeting");

  await page.getByRole("button", { name: "Create Event" }).click();

  await expect(page).toHaveURL("/day/2026-06-15");
  await expect(page.getByText("Team standup")).toBeVisible();
  await expect(page.getByText("Daily sync meeting")).toBeVisible();
});

test("dashboard shows today's events", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByText("Morning Run")).toBeVisible();
  await expect(page.getByText("Team Standup")).toBeVisible();
});

test("week view shows navigation to day pages", async ({ page }) => {
  await page.goto("/week");

  await expect(
    page.getByRole("heading", { name: "This Week" })
  ).toBeVisible();
});
