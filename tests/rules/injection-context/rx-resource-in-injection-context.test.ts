import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/rx-resource-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { rxResource } from "@angular/core/rxjs-interop";`;

const errors = [{ messageId: "rxResourceInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`rxResource({ stream })`, {}, errors)));
});

describe("explicit `injector` in the first argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `rxResource(${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Only direct calls are checked
      `other.rxResource(() => {});`,
      `rxResourceOther(() => {});`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { rxResource } from "other-lib";

rxResource();`,
    ],
    invalid: [],
  });
});
