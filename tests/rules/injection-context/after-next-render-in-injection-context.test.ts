import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/after-next-render-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { afterNextRender } from "@angular/core";`;

const errors = [{ messageId: "afterNextRenderInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`afterNextRender(() => {})`, {}, errors)));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `afterNextRender(() => {}, ${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Only direct calls are checked
      `other.afterNextRender(() => {});`,
      `afterNextRenderOther(() => {});`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { afterNextRender } from "other-lib";

afterNextRender();`,
    ],
    invalid: [],
  });
});
