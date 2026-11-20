import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/effect-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { effect } from "@angular/core";`;

const errors = [{ messageId: "effectInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`effect(() => {})`, {}, errors)));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `effect(() => {}, ${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Only direct calls are checked
      `other.effect(() => {});`,
      `effectOther(() => {});`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { effect } from "other-lib";

effect();`,
    ],
    invalid: [],
  });
});
