import * as rule from "../../../src/rules/signals/no-eager-change-detection.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noEagerChangeDetection";

testRule(rule, {
  valid: [
    // Doc examples: default strategy (Angular >= 22) and explicit `OnPush`
    `@Component() export class SomeComponent {}`,
    `@Component({ changeDetection: ChangeDetectionStrategy.OnPush }) export class SomeComponent {}`,
    // Import of the enum is not reported
    `import { ChangeDetectionStrategy } from "@angular/core";`,
    // The enum alone
    `const a = ChangeDetectionStrategy;`,
    // Look-alike property names
    `const a = [ChangeDetectionStrategy.eager, ChangeDetectionStrategy.default, ChangeDetectionStrategy.Defaults, ChangeDetectionStrategy.EagerX];`,
    // Look-alike object names
    `const a = [Strategy.Default, changeDetectionStrategy.Eager, ChangeDetection.Default, Other.Eager];`,
    // A native private member is a `PrivateIdentifier`
    `class A { #Default = 1; m() { return ChangeDetectionStrategy.#Default; } }`,
    // Computed access: the property is a `Literal`
    // SUSPECTED BUG: `ChangeDetectionStrategy["Default"]` is not reported
    `@Component({ changeDetection: ChangeDetectionStrategy["Default"] }) class A {}`,
    // The object is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import, `core.ChangeDetectionStrategy.Default` is not reported
    `@Component({ changeDetection: core.ChangeDetectionStrategy.Default }) class A {}`,
    // Aliased import
    // SUSPECTED BUG: with an aliased import, `Strategy.Default` is not reported
    `import { ChangeDetectionStrategy as Strategy } from "@angular/core"; @Component({ changeDetection: Strategy.Default }) class A {}`,
    // Raw enum value
    // SUSPECTED BUG: the raw value of `ChangeDetectionStrategy.Default` (`1`) is not reported
    `@Component({ changeDetection: 1 }) class A {}`,
    // Destructuring
    `const { Default } = ChangeDetectionStrategy;`,
  ],
  invalid: [
    // Doc examples
    { code: `@Component({ changeDetection: ChangeDetectionStrategy.Eager }) export class SomeComponent {}`, errors: [{ messageId }] },
    { code: `@Component({ changeDetection: ChangeDetectionStrategy.Default }) export class SomeComponent {}`, errors: [{ messageId }] },
    // With the import, only the usage is reported
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; @Component({ changeDetection: ChangeDetectionStrategy.Default }) class A {}`, errors: [{ messageId }] },
    // Any position, not only in `@Component()`
    { code: `const strategy = ChangeDetectionStrategy.Eager;`, errors: [{ messageId }] },
    { code: `if (a === ChangeDetectionStrategy.Default) {}`, errors: [{ messageId }] },
    { code: `TestBed.overrideComponent(A, { set: { changeDetection: ChangeDetectionStrategy.Default } });`, errors: [{ messageId }] },
    // Optional member access is still a `MemberExpression`
    { code: `const a = ChangeDetectionStrategy?.Eager;`, errors: [{ messageId }] },
    // Type position (`typeof`) is a `TSQualifiedName`, not a `MemberExpression`: only value usages count, so here only one report
    { code: `let a: typeof ChangeDetectionStrategy.Default = ChangeDetectionStrategy.Default;`, errors: [{ messageId }] },
    // One report per usage
    { code: `const a = [ChangeDetectionStrategy.Eager, ChangeDetectionStrategy.Default];`, errors: [{ messageId }, { messageId }] },
  ],
});
