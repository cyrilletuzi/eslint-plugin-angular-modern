import * as rule from "../../../src/rules/host-bindings/no-hostbinding-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHostbindingDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `host` property */
    `@Component({ host: { '[class.active]': 'active()', '(click)': 'onClick()' } }) class A {}`,
    /* Import only */
    `import { HostBinding } from '@angular/core';`,
    /* Decorator without call */
    `class A { @HostBinding a = true; }`,
    /* Member expression decorator */
    `class A { @ng.HostBinding('class.active') a = true; }`,
    /* Call which is not a decorator */
    `const a = HostBinding('class.active');`,
    /* Look-alike names */
    `class A { @HostBindings('class.active') a = true; @MyHostBinding('class.active') b = true; }`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { HostBinding as Alias } from '@angular/core'; class A { @Alias('class.active') a = true; }`,
  ],
  invalid: [
    /* On a property, in a Directive and in a Component */
    { code: `@Directive() class A { @HostBinding('class.active') a = true; }`, errors: [error] },
    { code: `@Component({}) class A { @HostBinding('class.active') a = true; }`, errors: [error] },
    /* Without Angular class decorator */
    { code: `class A { @HostBinding('class.active') a = true; }`, errors: [error] },
    /* On a method, getter, setter and accessor */
    { code: `class A { @HostBinding('class.active') method() {} }`, errors: [error] },
    { code: `class A { @HostBinding('class.active') get a() { return true; } }`, errors: [error] },
    { code: `class A { @HostBinding('class.active') set a(v: boolean) {} }`, errors: [error] },
    { code: `class A { @HostBinding('class.active') accessor a = true; }`, errors: [error] },
    /* Without arguments */
    { code: `class A { @HostBinding() a = true; }`, errors: [error] },
    /* Combined with other decorators */
    { code: `class A { @Input() @HostBinding('class.active') a = true; }`, errors: [error] },
    /* Any decorator position is matched */
    { code: `@HostBinding('class.active') class A {}`, errors: [error] },
    /* Import and usage: only the usage is reported */
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding('class.active') a = true; }`, errors: [error] },
    /* Several usages */
    { code: `class A { @HostBinding('class.active') a = true; @HostBinding('class.active') b() {} }`, errors: [error, error] },
  ],
});
