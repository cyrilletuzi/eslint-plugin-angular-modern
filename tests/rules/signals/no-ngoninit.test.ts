import * as rule from "../../../src/rules/signals/no-ngoninit.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgoninit";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngOnDestroy(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngoninit(): void {} }`,
    `@Component() class A { NgOnInit(): void {} }`,
    `@Component() class A { ngOnInit2(): void {} }`,
    `@Component() class A { myNgOnInit(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // SUSPECTED BUG: a hook defined as an arrow function property is still called by Angular, but is not reported
    `@Component() class A { ngOnInit = (): void => {}; }`,
    // Only an `Identifier` key is targeted: string literal and computed keys are ignored
    // SUSPECTED BUG: `'ngOnInit'()` and `['ngOnInit']()` define the same hook, but are not reported
    `@Component() class A { 'ngOnInit'(): void {} }`,
    `@Component() class A { ['ngOnInit'](): void {} }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngOnInit(): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngOnInit(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngOnInit(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngOnInit() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngOnInit();`,
    `class A extends B { foo(): void { super.ngOnInit(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements OnInit {}`,
    `import { OnInit } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngOnInit(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngOnInit(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngOnInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngOnInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngOnInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngOnInit(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngOnInit(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngOnInit(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngOnInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngOnInit(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngOnInit(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngOnInit() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngOnInit(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngOnInit(): void; ngOnInit(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngOnInit(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngOnInit(): void {} } class B { ngOnInit(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements OnInit, OnDestroy {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngOnInit(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
  ],
});
