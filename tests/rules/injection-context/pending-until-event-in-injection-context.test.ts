import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/pending-until-event-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { pendingUntilEvent } from "@angular/core/rxjs-interop";`;

const errors = [{ messageId: "pendingUntilEventInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`pendingUntilEvent()`, { routing: true, http: true, asyncAppInitialization: true }, errors)));
});

describe("explicit `Injector` in the first argument", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Any argument is accepted
      `obs.pipe(pendingUntilEvent(this.injector));`,
      `obs.pipe(pendingUntilEvent(injector));`,
      `obs.pipe(pendingUntilEvent(getInjector()));`,
    ],
    invalid: [
      { code: `obs.pipe(pendingUntilEvent());`, errors },
    ],
  }));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `other.pendingUntilEvent();`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { pendingUntilEvent } from "other-lib";

pendingUntilEvent();`,
    ],
    invalid: [],
  });
});
