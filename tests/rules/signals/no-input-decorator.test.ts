import * as rule from "../../../src/rules/signals/no-input-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noInputDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `import { Input } from "@angular/core"; @Component() class A { readonly a = input('alias'); }`,
    // Other Angular decorators must not match
    `import { Input } from "@angular/core"; @Component() class A { @HostListener("click") onClick(): void {} }`,
    // `Input`: importing it is not reported, only using it as a decorator
    `import { Input } from "@angular/core";`,
    // `Input`: called outside of a decorator
    `import { Input } from "@angular/core"; const a = Input('alias');`,
    `import { Input } from "@angular/core"; @Component() class A { a = Input('alias'); }`,
    // `Input`: used as a decorator without call is not reported
    `import { Input } from "@angular/core"; @Component() class A { @Input a; }`,
    // `Input`: look-alike names
    `import { Input } from "@angular/core"; @Component() class A { @input('alias') a; }`,
    `import { Input } from "@angular/core"; @Component() class A { @Inputs('alias') a; }`,
    `import { Input } from "@angular/core"; @Component() class A { @MyInput('alias') a; }`,
    // `Input`: namespace member
    // ACCEPTED FALSE NEGATIVE: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `import { Input } from "@angular/core"; @Component() class A { @core.Input('alias') a; }`,
    // `Input`: the decorator is a call of a call (callee is a `CallExpression`)
    `import { Input } from "@angular/core"; @Component() class A { @Input('alias')() a; }`,
    // Same name imported from another library is not reported
    `import { Input } from "other-lib"; class A { @Input('alias') a; }`,
  ],
  invalid: [
    // `Input`: on a property in a component
    { code: `import { Input } from "@angular/core"; @Component() class A { @Input('alias') a; }`, errors: [{ messageId }] },
    // `Input`: in a directive, with modifiers
    { code: `import { Input } from "@angular/core"; @Directive() class A { @Input('alias') protected readonly a!: string; }`, errors: [{ messageId }] },
    // `Input`: without arguments
    { code: `import { Input } from "@angular/core"; @Component() class A { @Input() a; }`, errors: [{ messageId }] },
    // `Input`: with an options object
    { code: `import { Input } from "@angular/core"; @Component() class A { @Input('alias', { foo: true }) a; }`, errors: [{ messageId }] },
    // `Input`: on a setter and on a method
    { code: `import { Input } from "@angular/core"; @Component() class A { @Input('alias') set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `import { Input } from "@angular/core"; @Component() class A { @Input('alias') a(): void {} }`, errors: [{ messageId }] },
    // `Input`: on a constructor parameter
    { code: `import { Input } from "@angular/core"; @Component() class A { constructor(@Input('alias') a: string) {} }`, errors: [{ messageId }] },
    // `Input`: on a class
    { code: `import { Input } from "@angular/core"; @Input('alias') class A {}`, errors: [{ messageId }] },
    // `Input`: not restricted to Angular classes
    { code: `import { Input } from "@angular/core"; class A { @Input('alias') a; }`, errors: [{ messageId }] },
    // `Input`: in a class expression
    { code: `import { Input } from "@angular/core"; const A = class { @Input('alias') a; };`, errors: [{ messageId }] },
    // `Input`: one report per decorator, also combined with other decorators
    { code: `import { Input } from "@angular/core"; @Component() class A { @Input('alias') a; @Input('alias') b; }`, errors: [{ messageId }, { messageId }] },
    { code: `import { Input } from "@angular/core"; @Component() class A { @HostBinding() @Input('alias') a; }`, errors: [{ messageId }] },
    // `Input`: aliased import is reported
    { code: `import { Input as NgInput } from "@angular/core"; @Component() class A { @NgInput('alias') a; }`, errors: [{ messageId }] },
  ],
});
