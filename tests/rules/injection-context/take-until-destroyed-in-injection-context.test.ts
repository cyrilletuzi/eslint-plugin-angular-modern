import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/take-until-destroyed-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases } from "./injection-contexts.js";

const errors = [{ messageId: "takeUntilDestroyedInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`takeUntilDestroyed()`, { routing: true, http: true, asyncAppInitialization: true }, errors));
});

describe("explicit `DestroyRef` in the first argument", () => {
  testRule(rule, {
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
  });
});

describe("as an RxJS operator", () => {
  testRule(rule, {
    valid: [
      `@Component() class C { a = obs.pipe(takeUntilDestroyed()); }`,
      `@Component() class C { constructor() { obs.pipe(takeUntilDestroyed()).subscribe(); } }`,
    ],
    invalid: [
      // Callbacks
      { code: `@Component() class C { a = obs.pipe(switchMap(() => other.pipe(takeUntilDestroyed()))); }`, errors },
      // KNOWN BUG: nested in another call
      { code: `runInInjectionContext(injector, () => { obs.pipe(takeUntilDestroyed()).subscribe(); });`, errors },
      { code: `const f: CanActivateFn = () => { const d = obs.pipe(takeUntilDestroyed()); return true; };`, errors },
    ],
  });
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      `other.takeUntilDestroyed();`,
    ],
    invalid: [],
  });
});
