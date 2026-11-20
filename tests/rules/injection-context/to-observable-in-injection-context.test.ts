import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/to-observable-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "toObservableInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`toObservable(source)`, { routing: true, http: true, asyncAppInitialization: true }, errors));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, objectArgumentCases((argument) => `toObservable(source, ${argument})`, "injector", errors));
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      `other.toObservable(source);`,
    ],
    invalid: [],
  });
});
