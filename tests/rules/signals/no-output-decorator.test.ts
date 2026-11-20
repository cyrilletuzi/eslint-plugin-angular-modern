import * as rule from "../../../src/rules/signals/no-output-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noOutputDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `import { Output } from "@angular/core"; @Component() class A { readonly a = output('alias'); }`,
    // Other Angular decorators must not match
    `import { Output } from "@angular/core"; @Component() class A { @HostListener("click") onClick(): void {} }`,
    // `Output`: importing it is not reported, only using it as a decorator
    `import { Output } from "@angular/core";`,
    // `Output`: called outside of a decorator
    `import { Output } from "@angular/core"; const a = Output('alias');`,
    `import { Output } from "@angular/core"; @Component() class A { a = Output('alias'); }`,
    // `Output`: used as a decorator without call is not reported
    `import { Output } from "@angular/core"; @Component() class A { @Output a; }`,
    // `Output`: look-alike names
    `import { Output } from "@angular/core"; @Component() class A { @output('alias') a; }`,
    `import { Output } from "@angular/core"; @Component() class A { @Outputs('alias') a; }`,
    `import { Output } from "@angular/core"; @Component() class A { @MyOutput('alias') a; }`,
    // `Output`: namespace member
    // ACCEPTED FALSE NEGATIVE: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `import { Output } from "@angular/core"; @Component() class A { @core.Output('alias') a; }`,
    // `Output`: the decorator is a call of a call (callee is a `CallExpression`)
    `import { Output } from "@angular/core"; @Component() class A { @Output('alias')() a; }`,
    // Same name imported from another library is not reported
    `import { Output } from "other-lib"; class A { @Output('alias') a; }`,
  ],
  invalid: [
    // `Output`: on a property in a component
    { code: `import { Output } from "@angular/core"; @Component() class A { @Output('alias') a; }`, errors: [{ messageId }] },
    // `Output`: in a directive, with modifiers
    { code: `import { Output } from "@angular/core"; @Directive() class A { @Output('alias') protected readonly a!: string; }`, errors: [{ messageId }] },
    // `Output`: without arguments
    { code: `import { Output } from "@angular/core"; @Component() class A { @Output() a; }`, errors: [{ messageId }] },
    // `Output`: with an options object
    { code: `import { Output } from "@angular/core"; @Component() class A { @Output('alias', { foo: true }) a; }`, errors: [{ messageId }] },
    // `Output`: on a setter and on a method
    { code: `import { Output } from "@angular/core"; @Component() class A { @Output('alias') set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `import { Output } from "@angular/core"; @Component() class A { @Output('alias') a(): void {} }`, errors: [{ messageId }] },
    // `Output`: on a constructor parameter
    { code: `import { Output } from "@angular/core"; @Component() class A { constructor(@Output('alias') a: string) {} }`, errors: [{ messageId }] },
    // `Output`: on a class
    { code: `import { Output } from "@angular/core"; @Output('alias') class A {}`, errors: [{ messageId }] },
    // `Output`: not restricted to Angular classes
    { code: `import { Output } from "@angular/core"; class A { @Output('alias') a; }`, errors: [{ messageId }] },
    // `Output`: in a class expression
    { code: `import { Output } from "@angular/core"; const A = class { @Output('alias') a; };`, errors: [{ messageId }] },
    // `Output`: one report per decorator, also combined with other decorators
    { code: `import { Output } from "@angular/core"; @Component() class A { @Output('alias') a; @Output('alias') b; }`, errors: [{ messageId }, { messageId }] },
    { code: `import { Output } from "@angular/core"; @Component() class A { @HostBinding() @Output('alias') a; }`, errors: [{ messageId }] },
    // `Output`: aliased import is reported
    { code: `import { Output as NgOutput } from "@angular/core"; @Component() class A { @NgOutput('alias') a; }`, errors: [{ messageId }] },
  ],
});
