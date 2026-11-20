import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/to-signal-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, objectArgumentCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { toSignal } from "@angular/core/rxjs-interop";`;

const errors = [{ messageId: "toSignalInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`toSignal(obs)`, {}, errors)));
});

describe("explicit `injector` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, objectArgumentCases((argument) => `toSignal(obs, ${argument})`, "injector", errors)));
});

describe("`manualCleanup` in the second argument", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `toSignal(obs, { manualCleanup: true });`,
      `toSignal(obs, { initialValue: 0, manualCleanup: true });`,
      // SUSPECTED BUG: the value is not checked
      `toSignal(obs, { manualCleanup: false });`,
      // Quoted `manualCleanup` key
      `toSignal(obs, { 'manualCleanup': true });`,
    ],
    invalid: [
      { code: `toSignal(obs, { initialValue: 0 });`, errors },
    ],
  }));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `other.toSignal(obs);`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { toSignal } from "other-lib";

toSignal();`,
    ],
    invalid: [],
  });
});
