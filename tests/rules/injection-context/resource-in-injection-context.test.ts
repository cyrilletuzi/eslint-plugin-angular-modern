import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/resource-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { resource } from "@angular/core";`;

const errors = [{ messageId: "resourceInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`resource({ loader })`, {}, errors)));
});

describe("explicit `injector` in the first argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `resource(${argument})`, "injector", errors)));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Only direct calls are checked
      `other.resource(() => {});`,
      `resourceOther(() => {});`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { resource } from "other-lib";

resource();`,
    ],
    invalid: [],
  });
});
