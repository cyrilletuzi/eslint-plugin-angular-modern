import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/httpresource-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { httpResource } from "@angular/common/http";`;

const errors = [{ messageId: "httpResourceInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`httpResource(() => '/api')`, {}, errors)));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `httpResource(() => '/api', ${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Only direct calls are checked
      `other.httpResource(() => {});`,
      `httpResourceOther(() => {});`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { httpResource } from "other-lib";

httpResource();`,
    ],
    invalid: [],
  });
});
