import * as rule from "../../../src/rules/signals/no-content-decorator.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noContentDecorator";

testRule(rule, {
  valid: [
    // Signal-based replacement
    `@Component() class A { readonly a = contentChild(Child); }`,
    // Other Angular decorators must not match
    `@Component() class A { @HostListener("click") onClick(): void {} }`,
    // `ContentChild`: importing it is not reported, only using it as a decorator
    `import { ContentChild } from "@angular/core";`,
    // `ContentChild`: called outside of a decorator
    `const a = ContentChild(Child);`,
    `@Component() class A { a = ContentChild(Child); }`,
    // `ContentChild`: used as a decorator without call (`Decorator > Identifier`, not `Decorator > CallExpression`)
    `@Component() class A { @ContentChild a; }`,
    // `ContentChild`: look-alike names
    `@Component() class A { @contentChild(Child) a; }`,
    `@Component() class A { @ContentChilds(Child) a; }`,
    `@Component() class A { @MyContentChild(Child) a; }`,
    // `ContentChild`: callee is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `@Component() class A { @core.ContentChild(Child) a; }`,
    // `ContentChild`: aliased import
    // SUSPECTED BUG: with an aliased import, the decorator is not reported
    `import { ContentChild as NgContentChild } from "@angular/core"; @Component() class A { @NgContentChild(Child) a; }`,
    // `ContentChild`: the decorator is a call of a call (callee is a `CallExpression`)
    `@Component() class A { @ContentChild(Child)() a; }`,
    // `ContentChildren`: importing it is not reported, only using it as a decorator
    `import { ContentChildren } from "@angular/core";`,
    // `ContentChildren`: called outside of a decorator
    `const a = ContentChildren(Child);`,
    `@Component() class A { a = ContentChildren(Child); }`,
    // `ContentChildren`: used as a decorator without call (`Decorator > Identifier`, not `Decorator > CallExpression`)
    `@Component() class A { @ContentChildren a; }`,
    // `ContentChildren`: look-alike names
    `@Component() class A { @contentChildren(Child) a; }`,
    `@Component() class A { @ContentChildrens(Child) a; }`,
    `@Component() class A { @MyContentChildren(Child) a; }`,
    // `ContentChildren`: callee is a `MemberExpression`, not an `Identifier`
    // SUSPECTED BUG: with a namespace import (`import * as core from "@angular/core"`), the decorator is not reported
    `@Component() class A { @core.ContentChildren(Child) a; }`,
    // `ContentChildren`: aliased import
    // SUSPECTED BUG: with an aliased import, the decorator is not reported
    `import { ContentChildren as NgContentChildren } from "@angular/core"; @Component() class A { @NgContentChildren(Child) a; }`,
    // `ContentChildren`: the decorator is a call of a call (callee is a `CallExpression`)
    `@Component() class A { @ContentChildren(Child)() a; }`,
  ],
  invalid: [
    // `ContentChild`: on a property in a component
    { code: `@Component() class A { @ContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChild`: in a directive, with modifiers
    { code: `@Directive() class A { @ContentChild(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ContentChild`: without arguments
    { code: `@Component() class A { @ContentChild() a; }`, errors: [{ messageId }] },
    // `ContentChild`: with an options object
    { code: `@Component() class A { @ContentChild(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ContentChild`: on a setter and on a method
    { code: `@Component() class A { @ContentChild(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { @ContentChild(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ContentChild`: on a constructor parameter
    { code: `@Component() class A { constructor(@ContentChild(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ContentChild`: on a class
    { code: `@ContentChild(Child) class A {}`, errors: [{ messageId }] },
    // `ContentChild`: not restricted to Angular classes, nor to `@angular/core` imports
    { code: `class A { @ContentChild(Child) a; }`, errors: [{ messageId }] },
    { code: `import { ContentChild } from "other-lib"; class A { @ContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChild`: in a class expression
    { code: `const A = class { @ContentChild(Child) a; };`, errors: [{ messageId }] },
    // `ContentChild`: with the import, only the decorator is reported
    { code: `import { ContentChild } from "@angular/core"; @Component() class A { @ContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChild`: one report per decorator, also combined with other decorators
    { code: `@Component() class A { @ContentChild(Child) a; @ContentChild(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `@Component() class A { @HostBinding() @ContentChild(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: on a property in a component
    { code: `@Component() class A { @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: in a directive, with modifiers
    { code: `@Directive() class A { @ContentChildren(Child) protected readonly a!: string; }`, errors: [{ messageId }] },
    // `ContentChildren`: without arguments
    { code: `@Component() class A { @ContentChildren() a; }`, errors: [{ messageId }] },
    // `ContentChildren`: with an options object
    { code: `@Component() class A { @ContentChildren(Child, { foo: true }) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: on a setter and on a method
    { code: `@Component() class A { @ContentChildren(Child) set a(value: string) {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { @ContentChildren(Child) a(): void {} }`, errors: [{ messageId }] },
    // `ContentChildren`: on a constructor parameter
    { code: `@Component() class A { constructor(@ContentChildren(Child) a: string) {} }`, errors: [{ messageId }] },
    // `ContentChildren`: on a class
    { code: `@ContentChildren(Child) class A {}`, errors: [{ messageId }] },
    // `ContentChildren`: not restricted to Angular classes, nor to `@angular/core` imports
    { code: `class A { @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    { code: `import { ContentChildren } from "other-lib"; class A { @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: in a class expression
    { code: `const A = class { @ContentChildren(Child) a; };`, errors: [{ messageId }] },
    // `ContentChildren`: with the import, only the decorator is reported
    { code: `import { ContentChildren } from "@angular/core"; @Component() class A { @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    // `ContentChildren`: one report per decorator, also combined with other decorators
    { code: `@Component() class A { @ContentChildren(Child) a; @ContentChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
    { code: `@Component() class A { @HostBinding() @ContentChildren(Child) a; }`, errors: [{ messageId }] },
    // Both names in the same class
    { code: `@Component() class A { @ContentChild(Child) a; @ContentChildren(Child) b; }`, errors: [{ messageId }, { messageId }] },
  ],
});
