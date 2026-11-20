
import { test, expect } from "./fixtures/test.js";

test.describe("AI Ticket Summary - Release Gate", () => {

  test("should generate a valid summary successfully", async ({ ticketPage }) => {
    await ticketPage.route("**/api/tickets/1001/summary", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "ok",
          summary: "The customer reports that their order has not arrived.",
          sourceIds: ["m1"]
        })
      });
    });

    await ticketPage.getByRole("button", { name: /generate summary/i }).click();

    await expect(ticketPage.getByTestId("summary"))
      .toContainText("The customer reports");

    await expect(ticketPage.getByText("Valid summary"))
      .toBeVisible();

    await expect(ticketPage.getByTestId("approve-button"))
      .toBeEnabled();
  });


  test("should handle insufficient information", async ({ ticketPage }) => {
    await ticketPage.route("**/api/tickets/1001/summary", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "insufficient_information"
        })
      });
    });

    await ticketPage.getByRole("button", { name: /generate summary/i }).click();

    await expect(ticketPage.locator("#status"))
        .toHaveText("Insufficient information");

    await expect(ticketPage.getByTestId("approve-button"))
      .toBeDisabled();
  });


  test("should recover after a 503 service error", async ({ ticketPage }) => {
    let requestCount = 0;

    await ticketPage.route("**/api/tickets/1001/summary", async (route) => {
      requestCount++;

      if (requestCount === 1) {
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: "unavailable" })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "ok",
            summary: "The customer reports a delayed order.",
            sourceIds: ["m1"]
          })
        });
      }
    });

    await ticketPage.getByRole("button", { name: /generate summary/i }).click();

    await expect(ticketPage.getByText("Generation failed"))
      .toBeVisible();

    await expect(ticketPage.getByRole("button", { name: /retry/i }))
      .toBeVisible();

    await ticketPage.getByRole("button", { name: /retry/i }).click();

    await expect(ticketPage.getByText("Valid summary"))
      .toBeVisible();

    await expect(ticketPage.getByTestId("approve-button"))
      .toBeEnabled();

    expect(requestCount).toBe(2);
  });


  test("should reject citations from another ticket", async ({ ticketPage }) => {
    await ticketPage.route("**/api/tickets/1001/summary", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "ok",
          summary: "The customer reports a delayed order.",
          sourceIds: ["m999"]
        })
      });
    });

    await ticketPage.getByRole("button", { name: /generate summary/i }).click();

    await expect(ticketPage.getByText("Invalid or missing citations"))
      .toBeVisible();

    await expect(ticketPage.getByTestId("approve-button"))
      .toBeDisabled();
  });


  test("should reject summaries with missing citations", async ({ ticketPage }) => {
    await ticketPage.route("**/api/tickets/1001/summary", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "ok",
          summary: "The customer reports a delayed order.",
          sourceIds: []
        })
      });
    });

    await ticketPage.getByRole("button", { name: /generate summary/i }).click();

    await expect(ticketPage.getByText("Invalid or missing citations"))
      .toBeVisible();

    await expect(ticketPage.getByTestId("approve-button"))
      .toBeDisabled();
  });

});
