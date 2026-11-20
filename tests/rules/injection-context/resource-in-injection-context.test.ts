import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/resource-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "resourceInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`resource({ loader })`, {}, errors));
});

describe("explicit `injector` in the first argument", () => {
  testRule(rule, objectArgumentCases((argument) => `resource(${argument})`, "injector", errors));
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      // Only direct calls are checked
      `other.resource(() => {});`,
      `resourceOther(() => {});`,
    ],
    invalid: [],
  });
});
