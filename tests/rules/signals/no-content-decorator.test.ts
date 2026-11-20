import * as rule from "../../../src/rules/signals/no-content-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noContentDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `import { ContentChild } from "@angular/core"; @Component() class A { readonly a = contentChild(Child); }`,
    // Other Angular decorators must not match
    `import { ContentChild } from "@angular/core"; @Component() class A { @HostListener("click") onClick(): void {} }`,
    // `ContentChild`: importing it is not reported, only using it as a decorator
    `import { ContentChild } from "@angular/core";`,
    // `ContentChild`: called outside of a decorator
    `import { ContentChild } from "@angular/core"; const a = ContentChild(Child);`,
    `import { ContentChild } from "@angular/core"; @Component() class A { a = ContentChild(Child); }`,
    // `ContentChild`: used as a decorator without call is not reported
    `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild a; }`,
    // `ContentChild`: look-alike names
    `import { ContentChild } from "@angular/core"; @Component() class A { @contentChild(Child) a; }`,
    `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChilds(Child) a; }`,
    `import { ContentChild } from "@angular/core"; @Component() class A { @MyContentChild(Child) a; }`,
    // `ContentChild`: namespace member
    // ACCEPTED FALSE NEGATIVE: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `import { ContentChild } from "@angular/core"; @Component() class A { @core.ContentChild(Child) a; }`,
    // `ContentChild`: the decorator is a call of a call (callee is a `CallExpression`)
    `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild(Child)() a; }`,
    // `ContentChildren`: importing it is not reported, only using it as a decorator
    `import { ContentChildren } from "@angular/core";`,
    // `ContentChildren`: called outside of a decorator
    `import { ContentChildren } from "@angular/core"; const a = ContentChildren(Child);`,
    `import { ContentChildren } from "@angular/core"; @Component() class A { a = ContentChildren(Child); }`,
    // `ContentChildren`: used as a decorator without call is not reported
    `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren a; }`,
    // `ContentChildren`: look-alike names
    `import { ContentChild } from "@angular/core"; @Component() class A { @contentChildren(Child) a; }`,
    `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChildrens(Child) a; }`,
    `import { ContentChild } from "@angular/core"; @Component() class A { @MyContentChildren(Child) a; }`,
    // `ContentChildren`: namespace member
    // ACCEPTED FALSE NEGATIVE: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `import { ContentChildren } from "@angular/core"; @Component() class A { @core.ContentChildren(Child) a; }`,
    // `ContentChildren`: the decorator is a call of a call (callee is a `CallExpression`)
    `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren(Child)() a; }`,
    // Same name imported from another library is not reported
    `import { ContentChild } from "other-lib"; class A { @ContentChild(Child) a; }`,
    // Same name imported from another library is not reported
    `import { ContentChildren } from "other-lib"; class A { @ContentChildren(Child) a; }`,
  ],
  invalid: [
    // `ContentChild`: on a property in a component
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChild`: in a directive, with modifiers
    { code: `import { ContentChild } from "@angular/core"; @Directive() class A { @ContentChild(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ContentChild`: without arguments
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild() a; }`, errors: [{ messageId }] },
    // `ContentChild`: with an options object
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ContentChild`: on a setter and on a method
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ContentChild`: on a constructor parameter
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { constructor(@ContentChild(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ContentChild`: on a class
    { code: `import { ContentChild } from "@angular/core"; @ContentChild(Child) class A {}`, errors: [{ messageId }] },
    // `ContentChild`: not restricted to Angular classes
    { code: `import { ContentChild } from "@angular/core"; class A { @ContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChild`: in a class expression
    { code: `import { ContentChild } from "@angular/core"; const A = class { @ContentChild(Child) a; };`, errors: [{ messageId }] },
    // `ContentChild`: one report per decorator, also combined with other decorators
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild(Child) a; @ContentChild(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @HostBinding() @ContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: on a property in a component
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: in a directive, with modifiers
    { code: `import { ContentChildren } from "@angular/core"; @Directive() class A { @ContentChildren(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ContentChildren`: without arguments
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren() a; }`, errors: [{ messageId }] },
    // `ContentChildren`: with an options object
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: on a setter and on a method
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ContentChildren`: on a constructor parameter
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { constructor(@ContentChildren(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ContentChildren`: on a class
    { code: `import { ContentChildren } from "@angular/core"; @ContentChildren(Child) class A {}`, errors: [{ messageId }] },
    // `ContentChildren`: not restricted to Angular classes
    { code: `import { ContentChildren } from "@angular/core"; class A { @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: in a class expression
    { code: `import { ContentChildren } from "@angular/core"; const A = class { @ContentChildren(Child) a; };`, errors: [{ messageId }] },
    // `ContentChildren`: one report per decorator, also combined with other decorators
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren(Child) a; @ContentChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @HostBinding() @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    // Both names in the same class
    { code: `import { ContentChild, ContentChildren } from "@angular/core"; @Component() class A { @ContentChild(Child) a; @ContentChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
    // `ContentChild`: aliased import is reported
    { code: `import { ContentChild as NgContentChild } from "@angular/core"; @Component() class A { @NgContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: aliased import is reported
    { code: `import { ContentChildren as NgContentChildren } from "@angular/core"; @Component() class A { @NgContentChildren(Child) a; }`, errors: [{ messageId }] },
  ],
});
