import * as rule from "../../../src/rules/signals/no-attribute-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noAttributeDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `import { Attribute } from "@angular/core"; @Component() class A { readonly a = input('option'); }`,
    // Other Angular decorators must not match
    `import { Attribute } from "@angular/core"; @Component() class A { @HostListener("click") onClick(): void {} }`,
    // `Attribute`: importing it is not reported, only using it as a decorator
    `import { Attribute } from "@angular/core";`,
    // `Attribute`: called outside of a decorator
    `import { Attribute } from "@angular/core"; const a = Attribute('option');`,
    `import { Attribute } from "@angular/core"; @Component() class A { a = Attribute('option'); }`,
    // `Attribute`: used as a decorator without call is not reported
    `import { Attribute } from "@angular/core"; @Component() class A { @Attribute a; }`,
    // `Attribute`: look-alike names
    `import { Attribute } from "@angular/core"; @Component() class A { @attribute('option') a; }`,
    `import { Attribute } from "@angular/core"; @Component() class A { @Attributes('option') a; }`,
    `import { Attribute } from "@angular/core"; @Component() class A { @MyAttribute('option') a; }`,
    // `Attribute`: namespace member
    // ACCEPTED FALSE NEGATIVE: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `import { Attribute } from "@angular/core"; @Component() class A { @core.Attribute('option') a; }`,
    // `Attribute`: the decorator is a call of a call (callee is a `CallExpression`)
    `import { Attribute } from "@angular/core"; @Component() class A { @Attribute('option')() a; }`,
    // Same name imported from another library is not reported
    `import { Attribute } from "other-lib"; class A { @Attribute('option') a; }`,
  ],
  invalid: [
    // `Attribute`: on a property in a component
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @Attribute('option') a; }`, errors: [{ messageId }] },
    // `Attribute`: in a directive, with modifiers
    { code: `import { Attribute } from "@angular/core"; @Directive() class A { @Attribute('option') protected readonly a!: string; }`, errors: [{ messageId }] },
    // `Attribute`: without arguments
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @Attribute() a; }`, errors: [{ messageId }] },
    // `Attribute`: with an options object
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @Attribute('option', { foo: true }) a; }`, errors: [{ messageId }] },
    // `Attribute`: on a setter and on a method
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @Attribute('option') set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @Attribute('option') a(): void {} }`, errors: [{ messageId }] },
    // `Attribute`: on a constructor parameter
    { code: `import { Attribute } from "@angular/core"; @Component() class A { constructor(@Attribute('option') a: string) {} }`, errors: [{ messageId }] },
    // `Attribute`: on a class
    { code: `import { Attribute } from "@angular/core"; @Attribute('option') class A {}`, errors: [{ messageId }] },
    // `Attribute`: not restricted to Angular classes
    { code: `import { Attribute } from "@angular/core"; class A { @Attribute('option') a; }`, errors: [{ messageId }] },
    // `Attribute`: in a class expression
    { code: `import { Attribute } from "@angular/core"; const A = class { @Attribute('option') a; };`, errors: [{ messageId }] },
    // `Attribute`: one report per decorator, also combined with other decorators
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @Attribute('option') a; @Attribute('option') b; }`, errors: [{ messageId }, { messageId }] },
    { code: `import { Attribute } from "@angular/core"; @Component() class A { @HostBinding() @Attribute('option') a; }`, errors: [{ messageId }] },
    // `Attribute`: aliased import is reported
    { code: `import { Attribute as NgAttribute } from "@angular/core"; @Component() class A { @NgAttribute('option') a; }`, errors: [{ messageId }] },
  ],
});
