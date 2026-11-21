import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/take-until-destroyed-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { takeUntilDestroyed } from "@angular/core/rxjs-interop";`;

const errors = [{ messageId: "takeUntilDestroyedInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`takeUntilDestroyed()`, { routing: true, http: true, asyncAppInitialization: true }, errors)));
});

describe("explicit `DestroyRef` in the first argument", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Any argument is accepted
      `obs.pipe(takeUntilDestroyed(this.destroyRef));`,
      `obs.pipe(takeUntilDestroyed(destroyRef));`,
      `obs.pipe(takeUntilDestroyed(getDestroyRef()));`,
      `@Component() class C { m() { obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(); } }`,
    ],
    invalid: [
      { code: `obs.pipe(takeUntilDestroyed());`, errors },
      { code: `@Component() class C { m() { obs.pipe(takeUntilDestroyed()).subscribe(); } }`, errors },
    ],
  }));
});

describe("as an RxJS operator", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `@Component() class C { a = obs.pipe(takeUntilDestroyed()); }`,
      `@Component() class C { constructor() { obs.pipe(takeUntilDestroyed()).subscribe(); } }`,
      `runInInjectionContext(injector, () => { obs.pipe(takeUntilDestroyed()).subscribe(); });`,
      `const f: CanActivateFn = () => { const d = obs.pipe(takeUntilDestroyed()); return true; };`,
    ],
    invalid: [
      // Callbacks
      { code: `@Component() class C { a = obs.pipe(switchMap(() => other.pipe(takeUntilDestroyed()))); }`, errors },
    ],
  }));
});

describe("other calls", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `other.takeUntilDestroyed();`,
    ],
    invalid: [],
  }));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { takeUntilDestroyed } from "other-lib";

takeUntilDestroyed();`,
    ],
    invalid: [],
  });
});
