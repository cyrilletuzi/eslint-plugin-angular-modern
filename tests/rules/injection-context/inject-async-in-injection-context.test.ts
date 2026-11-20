import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/inject-async-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { injectAsync } from "@angular/core";`;

const errors = [{ messageId: "injectAsyncInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`injectAsync(() => import('./a'))`, { routing: true, http: true }, errors)));
});

describe("no explicit injection context", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `other.injectAsync(() => import('./a'));`,
    ],
    invalid: [
      // Arguments do not matter
      { code: `injectAsync(() => import('./a'), { injector });`, errors },
      { code: `injectAsync(() => import('./a'), injector);`, errors },
    ],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { injectAsync } from "other-lib";

injectAsync();`,
    ],
    invalid: [],
  });
});
