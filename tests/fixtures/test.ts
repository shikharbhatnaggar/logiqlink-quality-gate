
import { test as base, expect, Page } from "@playwright/test";

type TestFixtures = {
  ticketPage: Page;
};

export const test = base.extend<TestFixtures>({

  ticketPage: async ({ page }, use) => {

    // Open the dashboard
    await page.goto("/");

    // Verify ticket is loaded
    await expect(
      page.getByRole("heading", {
        name: /Ticket #1001/
      })
    ).toBeVisible();

    // Make page available to the test
    await use(page);

  }

});

export { expect };