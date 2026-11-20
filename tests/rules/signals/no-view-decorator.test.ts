import * as rule from "../../../src/rules/signals/no-view-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noViewDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `import { ViewChild } from "@angular/core"; @Component() class A { readonly a = viewChild(Child); }`,
    // Other Angular decorators must not match
    `import { ViewChild } from "@angular/core"; @Component() class A { @HostListener("click") onClick(): void {} }`,
    // `ViewChild`: importing it is not reported, only using it as a decorator
    `import { ViewChild } from "@angular/core";`,
    // `ViewChild`: called outside of a decorator
    `import { ViewChild } from "@angular/core"; const a = ViewChild(Child);`,
    `import { ViewChild } from "@angular/core"; @Component() class A { a = ViewChild(Child); }`,
    // `ViewChild`: used as a decorator without call is not reported
    `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild a; }`,
    // `ViewChild`: look-alike names
    `import { ViewChild } from "@angular/core"; @Component() class A { @viewChild(Child) a; }`,
    `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChilds(Child) a; }`,
    `import { ViewChild } from "@angular/core"; @Component() class A { @MyViewChild(Child) a; }`,
    // `ViewChild`: namespace member
    // ACCEPTED FALSE NEGATIVE: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `import { ViewChild } from "@angular/core"; @Component() class A { @core.ViewChild(Child) a; }`,
    // `ViewChild`: the decorator is a call of a call (callee is a `CallExpression`)
    `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild(Child)() a; }`,
    // `ViewChildren`: importing it is not reported, only using it as a decorator
    `import { ViewChildren } from "@angular/core";`,
    // `ViewChildren`: called outside of a decorator
    `import { ViewChildren } from "@angular/core"; const a = ViewChildren(Child);`,
    `import { ViewChildren } from "@angular/core"; @Component() class A { a = ViewChildren(Child); }`,
    // `ViewChildren`: used as a decorator without call is not reported
    `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren a; }`,
    // `ViewChildren`: look-alike names
    `import { ViewChild } from "@angular/core"; @Component() class A { @viewChildren(Child) a; }`,
    `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChildrens(Child) a; }`,
    `import { ViewChild } from "@angular/core"; @Component() class A { @MyViewChildren(Child) a; }`,
    // `ViewChildren`: namespace member
    // ACCEPTED FALSE NEGATIVE: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `import { ViewChildren } from "@angular/core"; @Component() class A { @core.ViewChildren(Child) a; }`,
    // `ViewChildren`: the decorator is a call of a call (callee is a `CallExpression`)
    `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren(Child)() a; }`,
    // Same name imported from another library is not reported
    `import { ViewChild } from "other-lib"; class A { @ViewChild(Child) a; }`,
    // Same name imported from another library is not reported
    `import { ViewChildren } from "other-lib"; class A { @ViewChildren(Child) a; }`,
  ],
  invalid: [
    // `ViewChild`: on a property in a component
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChild`: in a directive, with modifiers
    { code: `import { ViewChild } from "@angular/core"; @Directive() class A { @ViewChild(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ViewChild`: without arguments
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild() a; }`, errors: [{ messageId }] },
    // `ViewChild`: with an options object
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ViewChild`: on a setter and on a method
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ViewChild`: on a constructor parameter
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { constructor(@ViewChild(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ViewChild`: on a class
    { code: `import { ViewChild } from "@angular/core"; @ViewChild(Child) class A {}`, errors: [{ messageId }] },
    // `ViewChild`: not restricted to Angular classes
    { code: `import { ViewChild } from "@angular/core"; class A { @ViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChild`: in a class expression
    { code: `import { ViewChild } from "@angular/core"; const A = class { @ViewChild(Child) a; };`, errors: [{ messageId }] },
    // `ViewChild`: one report per decorator, also combined with other decorators
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @ViewChild(Child) a; @ViewChild(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `import { ViewChild } from "@angular/core"; @Component() class A { @HostBinding() @ViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: on a property in a component
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: in a directive, with modifiers
    { code: `import { ViewChildren } from "@angular/core"; @Directive() class A { @ViewChildren(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ViewChildren`: without arguments
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren() a; }`, errors: [{ messageId }] },
    // `ViewChildren`: with an options object
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: on a setter and on a method
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ViewChildren`: on a constructor parameter
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { constructor(@ViewChildren(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ViewChildren`: on a class
    { code: `import { ViewChildren } from "@angular/core"; @ViewChildren(Child) class A {}`, errors: [{ messageId }] },
    // `ViewChildren`: not restricted to Angular classes
    { code: `import { ViewChildren } from "@angular/core"; class A { @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: in a class expression
    { code: `import { ViewChildren } from "@angular/core"; const A = class { @ViewChildren(Child) a; };`, errors: [{ messageId }] },
    // `ViewChildren`: one report per decorator, also combined with other decorators
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @ViewChildren(Child) a; @ViewChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `import { ViewChildren } from "@angular/core"; @Component() class A { @HostBinding() @ViewChildren(Child) a; }`, errors: [{ messageId }] },
    // Both names in the same class
    { code: `import { ViewChild, ViewChildren } from "@angular/core"; @Component() class A { @ViewChild(Child) a; @ViewChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
    // `ViewChild`: aliased import is reported
    { code: `import { ViewChild as NgViewChild } from "@angular/core"; @Component() class A { @NgViewChild(Child) a; }`, errors: [{ messageId }] },
    // `ViewChildren`: aliased import is reported
    { code: `import { ViewChildren as NgViewChildren } from "@angular/core"; @Component() class A { @NgViewChildren(Child) a; }`, errors: [{ messageId }] },
  ],
});
