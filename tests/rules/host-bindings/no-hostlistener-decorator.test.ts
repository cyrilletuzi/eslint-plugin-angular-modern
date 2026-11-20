import * as rule from "../../../src/rules/host-bindings/no-hostlistener-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHostlistenerDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `host` property */
    `import { HostListener } from '@angular/core'; @Component({ host: { '[class.active]': 'active()', '(click)': 'onClick()' } }) class A {}`,
    /* Import only */
    `import { HostListener } from '@angular/core';`,
    /* Decorator without call */
    `import { HostListener } from '@angular/core'; class A { @HostListener a = true; }`,
    /* Member expression decorator */
    `import { HostListener } from '@angular/core'; class A { @ng.HostListener('click', ['$event']) a = true; }`,
    /* Call which is not a decorator */
    `import { HostListener } from '@angular/core'; const a = HostListener('click', ['$event']);`,
    /* Look-alike names */
    `import { HostListener } from '@angular/core'; class A { @HostListeners('click', ['$event']) a = true; @MyHostListener('click', ['$event']) b = true; }`,
    /* Same name imported from another library is not reported */
    `import { HostListener } from 'other-lib'; class A { @HostListener('click') onClick() {} }`,
  ],
  invalid: [
    /* On a property, in a Directive and in a Component */
    { code: `import { HostListener } from '@angular/core'; @Directive() class A { @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    { code: `import { HostListener } from '@angular/core'; @Component({}) class A { @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    /* Without Angular class decorator */
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    /* On a method, getter, setter and accessor */
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener('click', ['$event']) method() {} }`, errors: [error] },
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener('click', ['$event']) get a() { return true; } }`, errors: [error] },
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener('click', ['$event']) set a(v: boolean) {} }`, errors: [error] },
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener('click', ['$event']) accessor a = true; }`, errors: [error] },
    /* Without arguments */
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener() a = true; }`, errors: [error] },
    /* Combined with other decorators */
    { code: `import { HostListener } from '@angular/core'; class A { @Input() @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    /* Any decorator position is matched */
    { code: `import { HostListener } from '@angular/core'; @HostListener('click', ['$event']) class A {}`, errors: [error] },
    /* Several usages */
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener('click', ['$event']) a = true; @HostListener('click', ['$event']) b() {} }`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { HostListener as Alias } from '@angular/core'; class A { @Alias('click', ['$event']) a = true; }`, errors: [error] },
  ],
});
