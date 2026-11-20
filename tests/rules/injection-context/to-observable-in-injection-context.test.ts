import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/to-observable-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { toObservable } from "@angular/core/rxjs-interop";`;

const errors = [{ messageId: "toObservableInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`toObservable(source)`, { routing: true, http: true, asyncAppInitialization: true }, errors)));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `toObservable(source, ${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `other.toObservable(source);`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { toObservable } from "other-lib";

toObservable();`,
    ],
    invalid: [],
  });
});
