import * as rule from "../../../src/rules/host-bindings/no-hostlistener-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHostlistenerDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `host` property */
    `@Component({ host: { '[class.active]': 'active()', '(click)': 'onClick()' } }) class A {}`,
    /* Import only */
    `import { HostListener } from '@angular/core';`,
    /* Decorator without call */
    `class A { @HostListener a = true; }`,
    /* Member expression decorator */
    `class A { @ng.HostListener('click', ['$event']) a = true; }`,
    /* Call which is not a decorator */
    `const a = HostListener('click', ['$event']);`,
    /* Look-alike names */
    `class A { @HostListeners('click', ['$event']) a = true; @MyHostListener('click', ['$event']) b = true; }`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { HostListener as Alias } from '@angular/core'; class A { @Alias('click', ['$event']) a = true; }`,
  ],
  invalid: [
    /* On a property, in a Directive and in a Component */
    { code: `@Directive() class A { @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    { code: `@Component({}) class A { @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    /* Without Angular class decorator */
    { code: `class A { @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    /* On a method, getter, setter and accessor */
    { code: `class A { @HostListener('click', ['$event']) method() {} }`, errors: [error] },
    { code: `class A { @HostListener('click', ['$event']) get a() { return true; } }`, errors: [error] },
    { code: `class A { @HostListener('click', ['$event']) set a(v: boolean) {} }`, errors: [error] },
    { code: `class A { @HostListener('click', ['$event']) accessor a = true; }`, errors: [error] },
    /* Without arguments */
    { code: `class A { @HostListener() a = true; }`, errors: [error] },
    /* Combined with other decorators */
    { code: `class A { @Input() @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    /* Any decorator position is matched */
    { code: `@HostListener('click', ['$event']) class A {}`, errors: [error] },
    /* Import and usage: only the usage is reported */
    { code: `import { HostListener } from '@angular/core'; class A { @HostListener('click', ['$event']) a = true; }`, errors: [error] },
    /* Several usages */
    { code: `class A { @HostListener('click', ['$event']) a = true; @HostListener('click', ['$event']) b() {} }`, errors: [error, error] },
  ],
});
