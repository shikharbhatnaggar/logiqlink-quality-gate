
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { evaluateSummary } from "./summary-evaluator.js";
import { evaluationExamples } from "./examples.js";

describe("Deterministic AI Summary Evaluation", () => {
  for (const example of evaluationExamples) {
    it(example.name, () => {
      const result = evaluateSummary(example.input);

      assert.equal(
        result.passed,
        example.expected,
        `Unexpected evaluation result. Issues: ${result.issues.join(", ")}`
      );

      if (example.expected) {
        assert.equal(result.issues.length, 0);
      } else {
        assert.ok(result.issues.length > 0);
      }
    });
  }
});
