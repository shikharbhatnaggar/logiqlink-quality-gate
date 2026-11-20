
# LogiQlink – AI Summary Quality Gate

A Playwright and TypeScript-based quality gate for an AI-assisted customer support ticket summarization feature.

The project demonstrates functional testing, deterministic summary evaluation, citation validation, error recovery, and CI-based release blocking.

## 1. Tech Stack

- Node.js 22
- TypeScript
- Express.js
- Playwright
- Node.js Test Runner
- GitHub Actions

## 2. Project Structure

```text
logiqlink-quality-gate/
├── .github/
│   └── workflows/
│       └── quality-gate.yml
├── public/
│   └── index.html
├── src/
│   ├── fixtures/
│   │   └── tickets.json
│   ├── evaluation/
│   │   ├── summary-evaluator.ts
│   │   ├── examples.ts
│   │   └── evaluation.test.ts
│   └── server.ts
├── tests/
│   ├── fixtures/
│   │   └── test.ts
│   └── summary.spec.ts
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

## 3. Setup

Requirements:
- Node.js 22 or compatible supported version
- npm

Install dependencies:

```bash
npm ci
```

Install Playwright Chromium:

```bash
npx playwright install chromium
```

Start the application:

```bash
npm run dev
```

Open http://localhost:3000

The application uses synthetic ticket data and mocked AI responses. No external AI credentials are required.

## 4. Run Tests

TypeScript validation:

```bash
npm run typecheck
```

Deterministic summary evaluation:

```bash
npm run test:evaluation
```

Playwright end-to-end tests:

```bash
npm run test:e2e
```

Open the Playwright HTML report:

```bash
npm run test:report
```

## 5. Test Coverage

### Playwright Functional Tests

1. Successful summary generation.
2. Handling insufficient information.
3. Recovery after a simulated HTTP 503 error.
4. Rejection of citations belonging to another ticket.
5. Rejection of summaries with missing citations.

### Deterministic Summary Evaluation

1. Accept a summary grounded in ticket messages.
2. Reject an unsupported factual claim.
3. Reject invalid source attribution.
4. Reject an empty summary.

## 6. Release Gate Criteria

The GitHub Actions workflow blocks the quality-gate job if:

- TypeScript type checking fails.
- Any deterministic evaluation test fails.
- Any required Playwright test fails.

Playwright failure evidence is uploaded as a GitHub Actions artifact, including available reports, screenshots, videos, and traces.

## 7. Intentional Regression Test

To verify that citation validation protects the approval workflow:

1. Open `public/index.html`.
2. Locate the `validateCitations()` function.
3. Temporarily replace its citation validation logic with:

```javascript
return true;
```

4. Run:

```bash
npm run test:e2e
```

5. The invalid-citation and missing-citation tests should fail because the application now incorrectly permits invalid citations.

6. Restore the original validation logic.
7. Run the Playwright tests again and confirm that all tests pass.

This demonstrates that the tests detect a meaningful regression rather than merely checking the happy path.

## 8. Test Boundaries and Limitations

### What is tested

- The real local Express application and dashboard.
- UI behaviour through Playwright.
- API response scenarios through Playwright route interception.
- Deterministic evaluation rules using synthetic examples.

### What is mocked

The AI summary service is mocked. No live AI model is called.

### Evaluator limitations

The deterministic evaluator checks:
- Summary presence.
- Citation presence.
- Citation membership in the current ticket.
- Whether supplied evidence quotes occur in their cited messages.

The evidence-quote check is a baseline grounding heuristic. It does not establish semantic entailment or detect every form of hallucination.

### Recommended production improvements

- Evaluate against a larger human-reviewed golden dataset.
- Add semantic claim-to-source entailment evaluation.
- Measure factual accuracy and citation precision.
- Test model versions for regressions.
- Add adversarial and ambiguous ticket scenarios.
- Monitor latency, failures, and quality in production.

## 9. AI Tool Usage and Verification

AI assistance was used during development for implementation guidance, test design, troubleshooting, and documentation.

Generated code and recommendations were reviewed and verified through:
- Local application execution.
- TypeScript type checking.
- Deterministic evaluation tests.
- Playwright end-to-end execution.
- Intentional regression testing.

All test scenarios use synthetic data and mocked responses. No external AI service credentials or customer data are used.

## 10. Summary

This project demonstrates a deterministic, repeatable quality gate for an AI-assisted support-ticket summarization workflow.

It combines functional UI testing, service failure handling, source attribution checks, baseline unsupported-claim detection, and automated CI validation.
