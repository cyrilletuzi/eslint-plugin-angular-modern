import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/to-signal-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "toSignalInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`toSignal(obs)`, {}, errors));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, objectArgumentCases((argument) => `toSignal(obs, ${argument})`, "injector", errors));
});

describe("`manualCleanup` in the second argument", () => {
  testRule(rule, {
    valid: [
      `toSignal(obs, { manualCleanup: true });`,
      `toSignal(obs, { initialValue: 0, manualCleanup: true });`,
      // SUSPECTED BUG: the value is not checked
      `toSignal(obs, { manualCleanup: false });`,
    ],
    invalid: [
      { code: `toSignal(obs, { initialValue: 0 });`, errors },
      { code: `toSignal(obs, { 'manualCleanup': true });`, errors },
    ],
  });
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      `other.toSignal(obs);`,
    ],
    invalid: [],
  });
});
