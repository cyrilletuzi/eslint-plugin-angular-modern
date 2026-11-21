import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/signal-form-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { form } from "@angular/forms/signals";`;

const errors = [{ messageId: "signalFormInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`form(model)`, {}, errors)));
});

describe("explicit `injector` in the second argument: `form(model, options)`", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `form(model, ${argument})`, "injector", errors)));
});

describe("explicit `injector` in the third argument: `form(model, schema, options)`", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `form(model, (path) => {}, ${argument})`, "injector", errors)));
});

describe("schema in the second argument", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // ACCEPTED FALSE NEGATIVE: with 2 arguments, a schema in a variable cannot be told apart from options, and is assumed to be options with an `injector` (schemas are written inline in Angular code)
      `form(model, schema);`,
    ],
    invalid: [
      // Inline schema function, the common case: it is not options, so there is no `injector`
      { code: `form(model, (path) => {});`, errors },
      { code: `form(model, (path) => { required(path.name); email(path.email); });`, errors },
      { code: `form(model, (path) => { customValidators(path); });`, errors },
      { code: `form(model, function (path) { required(path.name); });`, errors },
      { code: `form(model, (path: SchemaPathTree<User>) => { required(path.name); });`, errors },
      { code: `form(model, schema(), {});`, errors },
      // With 3 arguments, a schema in a variable is not mistaken for options
      { code: `form(model, schema, {});`, errors },
      { code: `form(model, (path) => {}, { injector }, extra);`, errors },
    ],
  }));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `other.form(model);`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { form } from "other-lib";

form();`,
    ],
    invalid: [],
  });
});
