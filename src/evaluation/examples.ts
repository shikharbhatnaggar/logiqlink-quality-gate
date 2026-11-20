import type { SummaryInput } from "./summary-evaluator.js";

export const ticketMessages = [
  {
    id: "m1",
    text: "My order has not arrived yet."
  },
  {
    id: "m2",
    text: "I placed the order on November 15."
  }
];

export const evaluationExamples: {
  name: string;
  input: SummaryInput;
  expected: boolean;
}[] = [
  {
    name: "Accept a summary grounded in ticket messages",
    expected: true,
    input: {
      summary:
        "The customer reports that their order has not arrived and says it was placed on November 15.",
      sourceIds: ["m1", "m2"],
      ticketMessages,
      claims: [
        {
          text: "The order has not arrived",
          sourceId: "m1",
          evidenceQuote: "My order has not arrived yet."
        },
        {
          text: "The order was placed on November 15",
          sourceId: "m2",
          evidenceQuote: "I placed the order on November 15."
        }
      ]
    }
  },
  {
    name: "Reject a summary with an unsupported claim",
    expected: false,
    input: {
      summary:
        "The customer reports that the order was delivered yesterday.",
      sourceIds: ["m1"],
      ticketMessages,
      claims: [
        {
          text: "The order was delivered yesterday",
          sourceId: "m1",
          evidenceQuote: "The order was delivered yesterday."
        }
      ]
    }
  },
  {
    name: "Reject a citation belonging to another ticket",
    expected: false,
    input: {
      summary: "The customer reports that the order has not arrived.",
      sourceIds: ["m999"],
      ticketMessages,
      claims: [
        {
          text: "The order has not arrived",
          sourceId: "m1",
          evidenceQuote: "My order has not arrived yet."
        }
      ]
    }
  },
  {
    name: "Reject an empty summary",
    expected: false,
    input: {
      summary: " ",
      sourceIds: ["m1"],
      ticketMessages,
      claims: [
        {
          text: "The order has not arrived",
          sourceId: "m1",
          evidenceQuote: "My order has not arrived yet."
        }
      ]
    }
  }
];
