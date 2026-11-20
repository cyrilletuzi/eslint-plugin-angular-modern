import * as rule from "../../../src/rules/signals/no-view-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noViewDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `@Component() class A { readonly a = viewChild(Child); }`,
    // Other Angular decorators must not match
    `@Component() class A { @HostListener("click") onClick(): void {} }`,
    // `ViewChild`: importing it is not reported, only using it as a decorator
    `import { ViewChild } from "@angular/core";`,
    // `ViewChild`: called outside of a decorator
    `const a = ViewChild(Child);`,
    `@Component() class A { a = ViewChild(Child); }`,
    // `ViewChild`: used as a decorator without call (`Decorator > Identifier`, not `Decorator > CallExpression`)
    `@Component() class A { @ViewChild a; }`,
    // `ViewChild`: look-alike names
    `@Component() class A { @viewChild(Child) a; }`,
    `@Component() class A { @ViewChilds(Child) a; }`,
    `@Component() class A { @MyViewChild(Child) a; }`,
    // `ViewChild`: callee is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `@Component() class A { @core.ViewChild(Child) a; }`,
    // `ViewChild`: aliased import
    // SUSPECTED BUG: with an aliased import, the decorator is not reported
    `import { ViewChild as NgViewChild } from "@angular/core"; @Component() class A { @NgViewChild(Child) a; }`,
    // `ViewChild`: the decorator is a call of a call (callee is a `CallExpression`)
    `@Component() class A { @ViewChild(Child)() a; }`,
    // `ViewChildren`: importing it is not reported, only using it as a decorator
    `import { ViewChildren } from "@angular/core";`,
    // `ViewChildren`: called outside of a decorator
    `const a = ViewChildren(Child);`,
    `@Component() class A { a = ViewChildren(Child); }`,
    // `ViewChildren`: used as a decorator without call (`Decorator > Identifier`, not `Decorator > CallExpression`)
    `@Component() class A { @ViewChildren a; }`,
    // `ViewChildren`: look-alike names
    `@Component() class A { @viewChildren(Child) a; }`,
    `@Component() class A { @ViewChildrens(Child) a; }`,
    `@Component() class A { @MyViewChildren(Child) a; }`,
    // `ViewChildren`: callee is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `@Component() class A { @core.ViewChildren(Child) a; }`,
    // `ViewChildren`: aliased import
    // SUSPECTED BUG: with an aliased import, the decorator is not reported
    `import { ViewChildren as NgViewChildren } from "@angular/core"; @Component() class A { @NgViewChildren(Child) a; }`,
    // `ViewChildren`: the decorator is a call of a call (callee is a `CallExpression`)
    `@Component() class A { @ViewChildren(Child)() a; }`,
  ],
  invalid: [
    // `ViewChild`: on a property in a component
    { code: `@Component() class A { @ViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChild`: in a directive, with modifiers
    { code: `@Directive() class A { @ViewChild(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ViewChild`: without arguments
    { code: `@Component() class A { @ViewChild() a; }`, errors: [{ messageId }] },
    // `ViewChild`: with an options object
    { code: `@Component() class A { @ViewChild(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ViewChild`: on a setter and on a method
    { code: `@Component() class A { @ViewChild(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { @ViewChild(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ViewChild`: on a constructor parameter
    { code: `@Component() class A { constructor(@ViewChild(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ViewChild`: on a class
    { code: `@ViewChild(Child) class A {}`, errors: [{ messageId }] },
    // `ViewChild`: not restricted to Angular classes, nor to `@angular/core` imports
    { code: `class A { @ViewChild(Child) a; }`, errors: [{ messageId }] },
    { code: `import { ViewChild } from "other-lib"; class A { @ViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChild`: in a class expression
    { code: `const A = class { @ViewChild(Child) a; };`, errors: [{ messageId }] },
    // `ViewChild`: with the import, only the decorator is reported
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChild`: one report per decorator, also combined with other decorators
    { code: `@Component() class A { @ViewChild(Child) a; @ViewChild(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `@Component() class A { @HostBinding() @ViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: on a property in a component
    { code: `@Component() class A { @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: in a directive, with modifiers
    { code: `@Directive() class A { @ViewChildren(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ViewChildren`: without arguments
    { code: `@Component() class A { @ViewChildren() a; }`, errors: [{ messageId }] },
    // `ViewChildren`: with an options object
    { code: `@Component() class A { @ViewChildren(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: on a setter and on a method
    { code: `@Component() class A { @ViewChildren(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { @ViewChildren(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ViewChildren`: on a constructor parameter
    { code: `@Component() class A { constructor(@ViewChildren(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ViewChildren`: on a class
    { code: `@ViewChildren(Child) class A {}`, errors: [{ messageId }] },
    // `ViewChildren`: not restricted to Angular classes, nor to `@angular/core` imports
    { code: `class A { @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    { code: `import { ViewChildren } from "other-lib"; class A { @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: in a class expression
    { code: `const A = class { @ViewChildren(Child) a; };`, errors: [{ messageId }] },
    // `ViewChildren`: with the import, only the decorator is reported
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: one report per decorator, also combined with other decorators
    { code: `@Component() class A { @ViewChildren(Child) a; @ViewChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `@Component() class A { @HostBinding() @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    // Both names in the same class
    { code: `@Component() class A { @ViewChild(Child) a; @ViewChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
  ],
});
