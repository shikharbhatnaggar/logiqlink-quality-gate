
export type TicketMessage = {
  id: string;
  text: string;
};

export type SummaryClaim = {
  text: string;
  sourceId: string;
  evidenceQuote: string;
};

export type SummaryInput = {
  summary: string;
  sourceIds: string[];
  ticketMessages: TicketMessage[];
  claims: SummaryClaim[];
};

export type EvaluationResult = {
  passed: boolean;
  issues: string[];
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function evaluateSummary(
  input: SummaryInput
): EvaluationResult {
  const issues: string[] = [];

  // Rule 1: Summary must not be empty.
  if (!input.summary || !input.summary.trim()) {
    issues.push("Summary is empty");
  }

  // Rule 2: At least one citation must be provided.
  if (!Array.isArray(input.sourceIds) || input.sourceIds.length === 0) {
    issues.push("No source citations provided");
  }

  const messagesById = new Map(
    input.ticketMessages.map((message) => [message.id, message])
  );

  // Rule 3: Every citation must belong to this ticket.
  if (Array.isArray(input.sourceIds)) {
    for (const sourceId of input.sourceIds) {
      if (!messagesById.has(sourceId)) {
        issues.push(`Invalid citation: ${sourceId}`);
      }
    }
  }

  // Rule 4: Each factual claim must have evidence in its cited message.
  for (const claim of input.claims ?? []) {
    const sourceMessage = messagesById.get(claim.sourceId);

    if (!sourceMessage) {
      issues.push(`Claim uses an invalid source: ${claim.sourceId}`);
      continue;
    }

    const evidence = normalize(claim.evidenceQuote);
    const sourceText = normalize(sourceMessage.text);

    if (!evidence || !sourceText.includes(evidence)) {
      issues.push(`Unsupported claim: ${claim.text}`);
    }
  }

  return {
    passed: issues.length === 0,
    issues
  };
}
