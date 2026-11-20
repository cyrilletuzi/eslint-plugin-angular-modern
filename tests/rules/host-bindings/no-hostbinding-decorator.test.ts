import * as rule from "../../../src/rules/host-bindings/no-hostbinding-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHostbindingDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `host` property */
    `import { HostBinding } from '@angular/core'; @Component({ host: { '[class.active]': 'active()', '(click)': 'onClick()' } }) class A {}`,
    /* Import only */
    `import { HostBinding } from '@angular/core';`,
    /* Decorator without call */
    `import { HostBinding } from '@angular/core'; class A { @HostBinding a = true; }`,
    /* Member expression decorator */
    `import { HostBinding } from '@angular/core'; class A { @ng.HostBinding('class.active') a = true; }`,
    /* Call which is not a decorator */
    `import { HostBinding } from '@angular/core'; const a = HostBinding('class.active');`,
    /* Look-alike names */
    `import { HostBinding } from '@angular/core'; class A { @HostBindings('class.active') a = true; @MyHostBinding('class.active') b = true; }`,
    /* Same name imported from another library is not reported */
    `import { HostBinding } from 'other-lib'; class A { @HostBinding('class.active') a = true; }`,
  ],
  invalid: [
    /* On a property, in a Directive and in a Component */
    { code: `import { HostBinding } from '@angular/core'; @Directive() class A { @HostBinding('class.active') a = true; }`, errors: [error] },
    { code: `import { HostBinding } from '@angular/core'; @Component({}) class A { @HostBinding('class.active') a = true; }`, errors: [error] },
    /* Without Angular class decorator */
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding('class.active') a = true; }`, errors: [error] },
    /* On a method, getter, setter and accessor */
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding('class.active') method() {} }`, errors: [error] },
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding('class.active') get a() { return true; } }`, errors: [error] },
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding('class.active') set a(v: boolean) {} }`, errors: [error] },
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding('class.active') accessor a = true; }`, errors: [error] },
    /* Without arguments */
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding() a = true; }`, errors: [error] },
    /* Combined with other decorators */
    { code: `import { HostBinding } from '@angular/core'; class A { @Input() @HostBinding('class.active') a = true; }`, errors: [error] },
    /* Any decorator position is matched */
    { code: `import { HostBinding } from '@angular/core'; @HostBinding('class.active') class A {}`, errors: [error] },
    /* Several usages */
    { code: `import { HostBinding } from '@angular/core'; class A { @HostBinding('class.active') a = true; @HostBinding('class.active') b() {} }`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { HostBinding as Alias } from '@angular/core'; class A { @Alias('class.active') a = true; }`, errors: [error] },
  ],
});
