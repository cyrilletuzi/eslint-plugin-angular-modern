import * as rule from "../../../src/rules/signals/no-input-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noInputDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `@Component() class A { readonly a = input('alias'); }`,
    // Other Angular decorators must not match
    `@Component() class A { @HostListener("click") onClick(): void {} }`,
    // `Input`: importing it is not reported, only using it as a decorator
    `import { Input } from "@angular/core";`,
    // `Input`: called outside of a decorator
    `const a = Input('alias');`,
    `@Component() class A { a = Input('alias'); }`,
    // `Input`: used as a decorator without call (`Decorator > Identifier`, not `Decorator > CallExpression`)
    `@Component() class A { @Input a; }`,
    // `Input`: look-alike names
    `@Component() class A { @input('alias') a; }`,
    `@Component() class A { @Inputs('alias') a; }`,
    `@Component() class A { @MyInput('alias') a; }`,
    // `Input`: callee is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `@Component() class A { @core.Input('alias') a; }`,
    // `Input`: aliased import
    // SUSPECTED BUG: with an aliased import, the decorator is not reported
    `import { Input as NgInput } from "@angular/core"; @Component() class A { @NgInput('alias') a; }`,
    // `Input`: the decorator is a call of a call (callee is a `CallExpression`)
    `@Component() class A { @Input('alias')() a; }`,
  ],
  invalid: [
    // `Input`: on a property in a component
    { code: `@Component() class A { @Input('alias') a; }`, errors: [{ messageId }] },
    // `Input`: in a directive, with modifiers
    { code: `@Directive() class A { @Input('alias') protected readonly a!: string; }`, errors: [{ messageId }] },
    // `Input`: without arguments
    { code: `@Component() class A { @Input() a; }`, errors: [{ messageId }] },
    // `Input`: with an options object
    { code: `@Component() class A { @Input('alias', { foo: true }) a; }`, errors: [{ messageId }] },
    // `Input`: on a setter and on a method
    { code: `@Component() class A { @Input('alias') set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { @Input('alias') a(): void {} }`, errors: [{ messageId }] },
    // `Input`: on a constructor parameter
    { code: `@Component() class A { constructor(@Input('alias') a: string) {} }`, errors: [{ messageId }] },
    // `Input`: on a class
    { code: `@Input('alias') class A {}`, errors: [{ messageId }] },
    // `Input`: not restricted to Angular classes, nor to `@angular/core` imports
    { code: `class A { @Input('alias') a; }`, errors: [{ messageId }] },
    { code: `import { Input } from "other-lib"; class A { @Input('alias') a; }`, errors: [{ messageId }] },
    // `Input`: in a class expression
    { code: `const A = class { @Input('alias') a; };`, errors: [{ messageId }] },
    // `Input`: with the import, only the decorator is reported
    { code: `import { Input } from "@angular/core"; @Component() class A { @Input('alias') a; }`, errors: [{ messageId }] },
    // `Input`: one report per decorator, also combined with other decorators
    { code: `@Component() class A { @Input('alias') a; @Input('alias') b; }`, errors: [{ messageId }, { messageId }] },
    { code: `@Component() class A { @HostBinding() @Input('alias') a; }`, errors: [{ messageId }] },
  ],
});
