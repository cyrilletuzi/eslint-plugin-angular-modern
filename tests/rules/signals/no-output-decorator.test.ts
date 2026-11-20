import * as rule from "../../../src/rules/signals/no-output-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noOutputDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `@Component() class A { readonly a = output('alias'); }`,
    // Other Angular decorators must not match
    `@Component() class A { @HostListener("click") onClick(): void {} }`,
    // `Output`: importing it is not reported, only using it as a decorator
    `import { Output } from "@angular/core";`,
    // `Output`: called outside of a decorator
    `const a = Output('alias');`,
    `@Component() class A { a = Output('alias'); }`,
    // `Output`: used as a decorator without call (`Decorator > Identifier`, not `Decorator > CallExpression`)
    `@Component() class A { @Output a; }`,
    // `Output`: look-alike names
    `@Component() class A { @output('alias') a; }`,
    `@Component() class A { @Outputs('alias') a; }`,
    `@Component() class A { @MyOutput('alias') a; }`,
    // `Output`: callee is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `@Component() class A { @core.Output('alias') a; }`,
    // `Output`: aliased import
    // SUSPECTED BUG: with an aliased import, the decorator is not reported
    `import { Output as NgOutput } from "@angular/core"; @Component() class A { @NgOutput('alias') a; }`,
    // `Output`: the decorator is a call of a call (callee is a `CallExpression`)
    `@Component() class A { @Output('alias')() a; }`,
  ],
  invalid: [
    // `Output`: on a property in a component
    { code: `@Component() class A { @Output('alias') a; }`, errors: [{ messageId }] },
    // `Output`: in a directive, with modifiers
    { code: `@Directive() class A { @Output('alias') protected readonly a!: string; }`, errors: [{ messageId }] },
    // `Output`: without arguments
    { code: `@Component() class A { @Output() a; }`, errors: [{ messageId }] },
    // `Output`: with an options object
    { code: `@Component() class A { @Output('alias', { foo: true }) a; }`, errors: [{ messageId }] },
    // `Output`: on a setter and on a method
    { code: `@Component() class A { @Output('alias') set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { @Output('alias') a(): void {} }`, errors: [{ messageId }] },
    // `Output`: on a constructor parameter
    { code: `@Component() class A { constructor(@Output('alias') a: string) {} }`, errors: [{ messageId }] },
    // `Output`: on a class
    { code: `@Output('alias') class A {}`, errors: [{ messageId }] },
    // `Output`: not restricted to Angular classes, nor to `@angular/core` imports
    { code: `class A { @Output('alias') a; }`, errors: [{ messageId }] },
    { code: `import { Output } from "other-lib"; class A { @Output('alias') a; }`, errors: [{ messageId }] },
    // `Output`: in a class expression
    { code: `const A = class { @Output('alias') a; };`, errors: [{ messageId }] },
    // `Output`: with the import, only the decorator is reported
    { code: `import { Output } from "@angular/core"; @Component() class A { @Output('alias') a; }`, errors: [{ messageId }] },
    // `Output`: one report per decorator, also combined with other decorators
    { code: `@Component() class A { @Output('alias') a; @Output('alias') b; }`, errors: [{ messageId }, { messageId }] },
    { code: `@Component() class A { @HostBinding() @Output('alias') a; }`, errors: [{ messageId }] },
  ],
});
