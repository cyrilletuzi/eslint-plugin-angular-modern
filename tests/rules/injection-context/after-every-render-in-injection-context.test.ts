import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/after-every-render-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { afterEveryRender } from "@angular/core";`;

const errors = [{ messageId: "afterEveryRenderInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`afterEveryRender(() => {})`, {}, errors)));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `afterEveryRender(() => {}, ${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Only direct calls are checked
      `other.afterEveryRender(() => {});`,
      `afterEveryRenderOther(() => {});`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { afterEveryRender } from "other-lib";

afterEveryRender();`,
    ],
    invalid: [],
  });
});
