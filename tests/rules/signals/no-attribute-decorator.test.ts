import * as rule from "../../../src/rules/signals/no-attribute-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noAttributeDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `@Component() class A { readonly a = input('option'); }`,
    // Other Angular decorators must not match
    `@Component() class A { @HostListener("click") onClick(): void {} }`,
    // `Attribute`: importing it is not reported, only using it as a decorator
    `import { Attribute } from "@angular/core";`,
    // `Attribute`: called outside of a decorator
    `const a = Attribute('option');`,
    `@Component() class A { a = Attribute('option'); }`,
    // `Attribute`: used as a decorator without call (`Decorator > Identifier`, not `Decorator > CallExpression`)
    `@Component() class A { @Attribute a; }`,
    // `Attribute`: look-alike names
    `@Component() class A { @attribute('option') a; }`,
    `@Component() class A { @Attributes('option') a; }`,
    `@Component() class A { @MyAttribute('option') a; }`,
    // `Attribute`: callee is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `@Component() class A { @core.Attribute('option') a; }`,
    // `Attribute`: aliased import
    // SUSPECTED BUG: with an aliased import, the decorator is not reported
    `import { Attribute as NgAttribute } from "@angular/core"; @Component() class A { @NgAttribute('option') a; }`,
    // `Attribute`: the decorator is a call of a call (callee is a `CallExpression`)
    `@Component() class A { @Attribute('option')() a; }`,
  ],
  invalid: [
    // `Attribute`: on a property in a component
    { code: `@Component() class A { @Attribute('option') a; }`, errors: [{ messageId }] },
    // `Attribute`: in a directive, with modifiers
    { code: `@Directive() class A { @Attribute('option') protected readonly a!: string; }`, errors: [{ messageId }] },
    // `Attribute`: without arguments
    { code: `@Component() class A { @Attribute() a; }`, errors: [{ messageId }] },
    // `Attribute`: with an options object
    { code: `@Component() class A { @Attribute('option', { foo: true }) a; }`, errors: [{ messageId }] },
    // `Attribute`: on a setter and on a method
    { code: `@Component() class A { @Attribute('option') set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { @Attribute('option') a(): void {} }`, errors: [{ messageId }] },
    // `Attribute`: on a constructor parameter
    { code: `@Component() class A { constructor(@Attribute('option') a: string) {} }`, errors: [{ messageId }] },
    // `Attribute`: on a class
    { code: `@Attribute('option') class A {}`, errors: [{ messageId }] },
    // `Attribute`: not restricted to Angular classes, nor to `@angular/core` imports
    { code: `class A { @Attribute('option') a; }`, errors: [{ messageId }] },
    { code: `import { Attribute } from "other-lib"; class A { @Attribute('option') a; }`, errors: [{ messageId }] },
    // `Attribute`: in a class expression
    { code: `const A = class { @Attribute('option') a; };`, errors: [{ messageId }] },
    // `Attribute`: with the import, only the decorator is reported
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @Attribute('option') a; }`, errors: [{ messageId }] },
    // `Attribute`: one report per decorator, also combined with other decorators
    { code: `@Component() class A { @Attribute('option') a; @Attribute('option') b; }`, errors: [{ messageId }, { messageId }] },
    { code: `@Component() class A { @HostBinding() @Attribute('option') a; }`, errors: [{ messageId }] },
  ],
});
