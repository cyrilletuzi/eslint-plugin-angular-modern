import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/after-render-effect-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { afterRenderEffect } from "@angular/core";`;

const errors = [{ messageId: "afterRenderEffectInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`afterRenderEffect(() => {})`, {}, errors)));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `afterRenderEffect(() => {}, ${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Only direct calls are checked
      `other.afterRenderEffect(() => {});`,
      `afterRenderEffectOther(() => {});`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { afterRenderEffect } from "other-lib";

afterRenderEffect();`,
    ],
    invalid: [],
  });
});
