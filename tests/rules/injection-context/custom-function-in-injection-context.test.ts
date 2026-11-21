import { Linter, type Rule } from "eslint";
import { describe, expect, it } from "vitest";
import * as rule from "../../../src/rules/injection-context/custom-function-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, type SpecialInjectionContexts } from "./injection-contexts.js";

const messageWithoutProperty = "`customInject()` must be called in an injection context, or an explicit injection context must be provided in an argument.";
const messageWithProperty = "`customInject()` must be called in an injection context, or `injector` must be provided in an argument.";
const errors = [{ message: messageWithoutProperty }];

function withOptions(cases: ReturnType<typeof injectionContextsCases>, options: unknown[]): ReturnType<typeof injectionContextsCases> {
  return {
    valid: cases.valid.map((code) => ({ code, options })) as never,
    invalid: cases.invalid.map((invalidCase) => ({ ...invalidCase, options })),
  };
}

describe("no configuration", () => {
  testRule(rule, {
    valid: [
      `customInject();`,
      { code: `customInject();`, options: [{}] },
      { code: `customInject();`, options: [{ functions: [] }] },
      // Other functions are ignored
      { code: `other();`, options: [{ functions: [{ name: "customInject" }] }] },
      { code: `customInjectOther();`, options: [{ functions: [{ name: "customInject" }] }] },
      // Only direct calls are checked
      { code: `other.customInject();`, options: [{ functions: [{ name: "customInject" }] }] },
    ],
    invalid: [],
  });
});

describe("special injection contexts", () => {
  const allSpecialContexts: readonly (readonly [string, keyof SpecialInjectionContexts])[] = [
    ["routing", "routing"],
    ["http", "http"],
    ["factory", "factories"],
    ["asyncApplicationInitialization", "asyncAppInitialization"],
    ["syncApplicationInitialization", "syncAppInitialization"],
  ];

  describe("none", () => {
    testRule(rule, withOptions(
      injectionContextsCases(`customInject()`, {}, errors),
      [{ functions: [{ name: "customInject" }] }],
    ));
  });

  describe("empty list", () => {
    testRule(rule, withOptions(
      injectionContextsCases(`customInject()`, {}, errors),
      [{ functions: [{ name: "customInject", allowedSpecialInjectionContexts: [] }] }],
    ));
  });

  for (const [optionName, specialContext] of allSpecialContexts) {
    describe(optionName, () => {
      testRule(rule, withOptions(
        injectionContextsCases(`customInject()`, { [specialContext]: true }, errors),
        [{ functions: [{ name: "customInject", allowedSpecialInjectionContexts: [optionName] }] }],
      ));
    });
  }

  describe("all", () => {
    testRule(rule, withOptions(
      injectionContextsCases(`customInject()`, {
        routing: true,
        http: true,
        factories: true,
        asyncAppInitialization: true,
        syncAppInitialization: true,
      }, errors),
      [{ functions: [{ name: "customInject", allowedSpecialInjectionContexts: allSpecialContexts.map(([optionName]) => optionName) }] }],
    ));
  });
});

describe("explicit injection context as a direct argument", () => {
  const options = [{ functions: [{ name: "customInject", argumentPosition: 1 }] }];

  testRule(rule, {
    valid: [
      // Any argument at the position is accepted
      { code: `customInject(a, injector);`, options },
      { code: `customInject(a, this.injector);`, options },
      { code: `customInject(a, {});`, options },
      { code: `customInject(a, undefined);`, options },
      { code: `customInject(a, injector, b);`, options },
      { code: `customInject(a, ...rest);`, options },
    ],
    invalid: [
      { code: `customInject();`, options, errors },
      { code: `customInject(a);`, options, errors },
    ],
  });
});

describe("explicit injection context as a direct first argument", () => {
  const options = [{ functions: [{ name: "customInject", argumentPosition: 0 }] }];

  testRule(rule, {
    valid: [
      { code: `customInject(injector);`, options },
    ],
    invalid: [
      { code: `customInject();`, options, errors },
    ],
  });
});

describe("explicit injection context in an object argument property", () => {
  const options = [{ functions: [{ name: "customInject", argumentPosition: 1, argumentPropertyName: "injector" }] }];
  const errors = [{ message: messageWithProperty }];

  testRule(rule, {
    valid: [
      { code: `customInject(a, { injector });`, options },
      { code: `customInject(a, { other: true, injector: this.injector });`, options },
      // Options in a local `const` initialized with an object literal are resolved
      { code: `const o = { injector };\ncustomInject(a, o);`, options },
      // KNOWN LIMITATION (FALSE NEGATIVE): options in a variable which cannot be resolved are supposed to contain the property
      { code: `customInject(a, options);`, options },
    ],
    invalid: [
      { code: `customInject();`, options, errors },
      { code: `customInject(a);`, options, errors },
      { code: `customInject(a, {});`, options, errors },
      { code: `customInject(a, { other: true });`, options, errors },
      { code: `customInject(a, this.options);`, options, errors },
      { code: `const o = { other: true };\ncustomInject(a, o);`, options, errors },
      { code: `customInject({ injector });`, options, errors },
    ],
  });
});

describe("property name without position", () => {
  testRule(rule, {
    valid: [],
    invalid: [
      // The property name is ignored without a position, but it is still used in the message
      {
        code: `customInject({ injector });`,
        options: [{ functions: [{ name: "customInject", argumentPropertyName: "injector" }] }],
        errors: [{ message: messageWithProperty }],
      },
    ],
  });
});

describe("multiple functions", () => {
  const options = [{
    functions: [
      { name: "customInject" },
      { name: "otherInject", argumentPosition: 0 },
      { name: "otherInject", allowedSpecialInjectionContexts: ["routing"] },
    ],
  }];

  testRule(rule, {
    valid: [
      { code: `@Component() class C { a = customInject(); b = otherInject(); }`, options },
      { code: `otherInject(injector);`, options },
      // Only the first matching configuration is used
      // (the second `otherInject` configuration would accept routing)
    ],
    invalid: [
      { code: `customInject(); otherInject();`, options, errors: [...errors, { message: "`otherInject()` must be called in an injection context, or an explicit injection context must be provided in an argument." }] },
      { code: `const f: CanActivateFn = () => { otherInject(); return true; };`, options, errors: [{ message: "`otherInject()` must be called in an injection context, or an explicit injection context must be provided in an argument." }] },
    ],
  });
});

describe("invalid configuration", () => {
  const invalidOptions: readonly [string, unknown][] = [
    ["missing name", { functions: [{}] }],
    ["empty name", { functions: [{ name: "" }] }],
    ["negative position", { functions: [{ name: "customInject", argumentPosition: -1 }] }],
    ["empty property name", { functions: [{ name: "customInject", argumentPosition: 0, argumentPropertyName: "" }] }],
    ["unknown special context", { functions: [{ name: "customInject", allowedSpecialInjectionContexts: ["other"] }] }],
    ["unknown function option", { functions: [{ name: "customInject", other: true }] }],
    ["unknown option", { other: true }],
  ];

  for (const [title, options] of invalidOptions) {
    it(title, () => {
      const linter = new Linter();
      expect(() => linter.verify(`customInject();`, {
        plugins: { test: { rules: { [rule.ruleName]: rule.ruleDefinition as unknown as Rule.RuleModule } } },
        rules: { [`test/${rule.ruleName}`]: ["error", options] },
      })).toThrow(/Key "rules": Key "test\/custom-function-in-injection-context"/);
    });
  }
});
