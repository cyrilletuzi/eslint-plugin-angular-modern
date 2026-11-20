import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/rx-resource-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "rxResourceInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`rxResource({ stream })`, {}, errors));
});

describe("explicit `injector` in the first argument", () => {
  testRule(rule, objectArgumentCases((argument) => `rxResource(${argument})`, "injector", errors));
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      // Only direct calls are checked
      `other.rxResource(() => {});`,
      `rxResourceOther(() => {});`,
    ],
    invalid: [],
  });
});
