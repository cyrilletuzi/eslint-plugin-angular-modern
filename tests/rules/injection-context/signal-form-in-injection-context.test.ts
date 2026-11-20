import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/signal-form-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases } from "./injection-contexts.js";

const errors = [{ messageId: "signalFormInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`form(model)`, {}, errors));
});

describe("explicit `injector` in the second argument: `form(model, options)`", () => {
  testRule(rule, objectArgumentCases((argument) => `form(model, ${argument})`, "injector", errors));
});

describe("explicit `injector` in the third argument: `form(model, schema, options)`", () => {
  testRule(rule, objectArgumentCases((argument) => `form(model, (path) => {}, ${argument})`, "injector", errors));
});

describe("schema in the second argument", () => {
  testRule(rule, {
    valid: [
      // SUSPECTED BUG: a schema in a variable is considered as options with an `injector`
      `form(model, schema);`,
      `form(model, schema, {});`,
    ],
    invalid: [
      { code: `form(model, (path) => {});`, errors },
      { code: `form(model, schema(), {});`, errors },
      { code: `form(model, (path) => {}, { injector }, extra);`, errors },
    ],
  });
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      `other.form(model);`,
    ],
    invalid: [],
  });
});
