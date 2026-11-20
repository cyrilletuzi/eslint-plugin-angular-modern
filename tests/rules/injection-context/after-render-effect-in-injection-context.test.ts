import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/after-render-effect-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "afterRenderEffectInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`afterRenderEffect(() => {})`, {}, errors));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, objectArgumentCases((argument) => `afterRenderEffect(() => {}, ${argument})`, "injector", errors));
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      // Only direct calls are checked
      `other.afterRenderEffect(() => {});`,
      `afterRenderEffectOther(() => {});`,
    ],
    invalid: [],
  });
});
