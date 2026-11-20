import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/httpresource-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "httpResourceInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`httpResource(() => '/api')`, {}, errors));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, objectArgumentCases((argument) => `httpResource(() => '/api', ${argument})`, "injector", errors));
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      // Only direct calls are checked
      `other.httpResource(() => {});`,
      `httpResourceOther(() => {});`,
    ],
    invalid: [],
  });
});
