import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/pending-until-event-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases } from "./injection-contexts.js";

const errors = [{ messageId: "pendingUntilEventInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`pendingUntilEvent()`, { routing: true, http: true, asyncAppInitialization: true }, errors));
});

describe("explicit `Injector` in the first argument", () => {
  testRule(rule, {
    valid: [
      // Any argument is accepted
      `obs.pipe(pendingUntilEvent(this.injector));`,
      `obs.pipe(pendingUntilEvent(injector));`,
      `obs.pipe(pendingUntilEvent(getInjector()));`,
    ],
    invalid: [
      { code: `obs.pipe(pendingUntilEvent());`, errors },
    ],
  });
});

describe("other calls", () => {
  testRule(rule, {
    valid: [
      `other.pendingUntilEvent();`,
    ],
    invalid: [],
  });
});
