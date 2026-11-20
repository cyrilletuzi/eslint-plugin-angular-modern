import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/inject-async-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases } from "./injection-contexts.js";

const errors = [{ messageId: "injectAsyncInInjectionContext" }];

describe("injection contexts", () => {
  testRule(rule, injectionContextsCases(`injectAsync(() => import('./a'))`, { routing: true, http: true }, errors));
});

describe("no explicit injection context", () => {
  testRule(rule, {
    valid: [
      `other.injectAsync(() => import('./a'));`,
    ],
    invalid: [
      // Arguments do not matter
      { code: `injectAsync(() => import('./a'), { injector });`, errors },
      { code: `injectAsync(() => import('./a'), injector);`, errors },
    ],
  });
});
