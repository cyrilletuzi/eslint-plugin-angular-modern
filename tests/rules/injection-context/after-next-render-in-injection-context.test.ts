import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/after-next-render-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "afterNextRenderInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`afterNextRender(() => {})`, {}, errors));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, objectArgumentCases((argument) => `afterNextRender(() => {}, ${argument})`, "injector", errors));
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      // Only direct calls are checked
      `other.afterNextRender(() => {});`,
      `afterNextRenderOther(() => {});`,
    ],
    invalid: [],
  });
});
