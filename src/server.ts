
import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

// Load synthetic ticket data
const ticketData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src/fixtures/tickets.json"),
    "utf-8"
  )
);

// Serve dashboard
app.use(express.static(path.join(process.cwd(), "public")));

// Get ticket details
app.get("/api/tickets/:ticketId", (req, res) => {
  const ticket = ticketData.tickets.find(
    (item: any) => item.id === req.params.ticketId
  );

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  res.json(ticket);
});

// Mock AI summary generation
app.post("/api/tickets/:ticketId/summary", (req, res) => {

  const { scenario = "success" } = req.body;

  switch (scenario) {

    // Scenario 1: Valid summary
    case "success":
      return res.status(200).json({
        status: "ok",
        summary:
          "The customer reports that their order has not arrived. The order was placed on November 15.",
        sourceIds: ["m1", "m2"]
      });

    // Scenario 2: Insufficient information
    case "insufficient":
      return res.status(200).json({
        status: "insufficient_information"
      });

    // Scenario 3: Service unavailable
    case "unavailable":
      return res.status(503).json({
        error: "unavailable"
      });

    // Scenario 4: Invalid cross-ticket citation
    case "invalid-citation":
      return res.status(200).json({
        status: "ok",
        summary:
          "The customer reports a delayed order.",
        sourceIds: ["m999"]
      });

    // Scenario 5: Missing citations
    case "missing-citation":
      return res.status(200).json({
        status: "ok",
        summary:
          "The customer reports a delayed order.",
        sourceIds: []
      });

    default:
      return res.status(400).json({
        error: "Unknown scenario"
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
