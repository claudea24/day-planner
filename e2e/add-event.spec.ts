import { test, expect } from "@playwright/test";

test("user can add a task and see it in the weekly inbox", async ({ page }) => {
  await page.goto("/add");

  await expect(page.getByRole("heading", { name: "Add Item" })).toBeVisible();

  // Should default to Task tab
  await page.getByLabel("Task Title").fill("Review pull request");
  await page.getByText("P0Must do").click();
  await page.getByLabel("Category").selectOption("work");

  await page.getByRole("button", { name: "Create Task" }).click();

  // Should redirect to inbox
  await expect(page).toHaveURL("/");
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

test("day view shows both schedule and tasks sections", async ({ page }) => {
  // Navigate to today via the inbox
  await page.goto("/");

  // Click "Day View" or navigate directly
  const today = new Date().toISOString().split("T")[0];
  await page.goto(`/day/${today}`);

  await expect(page.getByText("Schedule")).toBeVisible();
  await expect(page.getByText("Tasks")).toBeVisible();
});
