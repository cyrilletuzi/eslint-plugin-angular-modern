import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/effect-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "effectInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`effect(() => {})`, {}, errors));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, objectArgumentCases((argument) => `effect(() => {}, ${argument})`, "injector", errors));
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      // Only direct calls are checked
      `other.effect(() => {});`,
      `effectOther(() => {});`,
    ],
    invalid: [],
  });
});
