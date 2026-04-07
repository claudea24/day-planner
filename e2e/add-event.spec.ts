import { test, expect } from "@playwright/test";

test("user can add a task inline in the inbox", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Weekly Inbox" })
  ).toBeVisible();

  // Use the inline "Add a task..." input in the P0 section
  const addInput = page.getByPlaceholder("Add a task...").first();
  await addInput.fill("Review pull request");
  await addInput.press("Enter");

  await expect(page.getByText("Review pull request")).toBeVisible();
});

test("user can add a scheduled event and see it on the day page", async ({
  page,
}) => {
  await page.goto("/add?tab=event");

  // Click Event tab
  await page.getByRole("button", { name: "Event", exact: true }).click();

  await page.getByLabel("Event Title").fill("Design review meeting");
  await page.getByLabel("Date").fill("2026-06-15");
  await page.getByLabel("Start Time").fill("14:00");
  await page.getByLabel("End Time").fill("15:00");
  await page.getByLabel("Category").selectOption("work");
  await page.getByLabel("Notes").fill("Review new homepage mockups");

  await page.getByRole("button", { name: "Create Event" }).click();

  await expect(page).toHaveURL("/day/2026-06-15");
  await expect(page.getByText("Design review meeting")).toBeVisible();
});

test("weekly inbox shows tasks grouped by priority", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Weekly Inbox" })
  ).toBeVisible();

  // Seed data should show priority sections
  await expect(page.getByText("Must do this week")).toBeVisible();
  await expect(page.getByText("Should do if time allows")).toBeVisible();
  await expect(page.getByText("Can push to next week")).toBeVisible();

  // Seed tasks should be visible
  await expect(page.getByText("Ship auth API endpoint")).toBeVisible();
  await expect(page.getByText("Write blog post")).toBeVisible();
});

test("day view shows hourly grid with time labels", async ({ page }) => {
  const today = new Date().toISOString().split("T")[0];
  await page.goto(`/day/${today}`);

  // Should show hourly time labels and today button
  await expect(page.getByText("Today")).toBeVisible();
  await expect(page.getByText("9:00 AM")).toBeVisible();
});

test("week view shows calendar grid with time labels", async ({ page }) => {
  await page.goto("/week");

  // Should show today button and hourly time labels
  await expect(page.getByText("Today")).toBeVisible();
  await expect(page.getByText("9:00 AM")).toBeVisible();
});
