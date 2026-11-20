import * as rule from "../../../src/rules/signals/no-eager-change-detection.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noEagerChangeDetection";

testRule(rule, {
  valid: [
    // Doc examples: default strategy (Angular >= 22) and explicit `OnPush`
    `@Component() export class SomeComponent {}`,
    `import { ChangeDetectionStrategy } from "@angular/core"; @Component({ changeDetection: ChangeDetectionStrategy.OnPush }) export class SomeComponent {}`,
    // Import of the enum is not reported
    `import { ChangeDetectionStrategy } from "@angular/core";`,
    // The enum alone
    `import { ChangeDetectionStrategy } from "@angular/core"; const a = ChangeDetectionStrategy;`,
    // Look-alike property names
    `import { ChangeDetectionStrategy } from "@angular/core"; const a = [ChangeDetectionStrategy.eager, ChangeDetectionStrategy.default, ChangeDetectionStrategy.Defaults, ChangeDetectionStrategy.EagerX];`,
    // Look-alike object names
    `const a = [Strategy.Default, changeDetectionStrategy.Eager, ChangeDetection.Default, Other.Eager];`,
    // A native private member is not a usage
    `import { ChangeDetectionStrategy } from "@angular/core"; class A { #Default = 1; m() { return ChangeDetectionStrategy.#Default; } }`,
    // The object is a `MemberExpression`, not an `Identifier`
    // ACCEPTED FALSE NEGATIVE: with a namespace import, `core.ChangeDetectionStrategy.Default` is not reported
    `import { ChangeDetectionStrategy } from "@angular/core"; @Component({ changeDetection: core.ChangeDetectionStrategy.Default }) class A {}`,
    // Raw enum value
    // SUSPECTED BUG: the raw value of `ChangeDetectionStrategy.Default` (`1`) is not reported
    `@Component({ changeDetection: 1 }) class A {}`,
    // Destructuring
    `import { ChangeDetectionStrategy } from "@angular/core"; const { Default } = ChangeDetectionStrategy;`,
    // ACCEPTED FALSE NEGATIVE: computed access with a string is not reported (unnecessary computed access, already flagged by `dot-notation`)
    `import { ChangeDetectionStrategy } from "@angular/core"; @Component({ changeDetection: ChangeDetectionStrategy["Default"] }) class A {}`,
  ],
  invalid: [
    // Doc examples
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; @Component({ changeDetection: ChangeDetectionStrategy.Eager }) export class SomeComponent {}`, errors: [{ messageId }] },
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; @Component({ changeDetection: ChangeDetectionStrategy.Default }) export class SomeComponent {}`, errors: [{ messageId }] },
    // With the import, only the usage is reported
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; @Component({ changeDetection: ChangeDetectionStrategy.Default }) class A {}`, errors: [{ messageId }] },
    // Any position, not only in `@Component()`
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; const strategy = ChangeDetectionStrategy.Eager;`, errors: [{ messageId }] },
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; if (a === ChangeDetectionStrategy.Default) {}`, errors: [{ messageId }] },
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; TestBed.overrideComponent(A, { set: { changeDetection: ChangeDetectionStrategy.Default } });`, errors: [{ messageId }] },
    // Optional member access is still a `MemberExpression`
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; const a = ChangeDetectionStrategy?.Eager;`, errors: [{ messageId }] },
    // Type position (`typeof`) is a `TSQualifiedName`, not a `MemberExpression`: only value usages count, so here only one report
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; let a: typeof ChangeDetectionStrategy.Default = ChangeDetectionStrategy.Default;`, errors: [{ messageId }] },
    // One report per usage
    { code: `import { ChangeDetectionStrategy } from "@angular/core"; const a = [ChangeDetectionStrategy.Eager, ChangeDetectionStrategy.Default];`, errors: [{ messageId }, { messageId }] },
    // Aliased import is reported
    { code: `import { ChangeDetectionStrategy as Strategy } from "@angular/core"; @Component({ changeDetection: Strategy.Default }) class A {}`, errors: [{ messageId }] },
  ],
});
