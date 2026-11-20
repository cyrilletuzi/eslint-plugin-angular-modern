import * as rule from "../../../src/rules/signals/no-ngaftercontentinit.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgaftercontentinit";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngAfterContentChecked(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngaftercontentinit(): void {} }`,
    `@Component() class A { NgAfterContentInit(): void {} }`,
    `@Component() class A { ngAfterContentInit2(): void {} }`,
    `@Component() class A { myNgAfterContentInit(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // SUSPECTED BUG: a hook defined as an arrow function property is still called by Angular, but is not reported
    `@Component() class A { ngAfterContentInit = (): void => {}; }`,
    // Only an `Identifier` key is targeted: string literal and computed keys are ignored
    // SUSPECTED BUG: `'ngAfterContentInit'()` and `['ngAfterContentInit']()` define the same hook, but are not reported
    `@Component() class A { 'ngAfterContentInit'(): void {} }`,
    `@Component() class A { ['ngAfterContentInit'](): void {} }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngAfterContentInit(): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngAfterContentInit(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngAfterContentInit(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngAfterContentInit() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngAfterContentInit();`,
    `class A extends B { foo(): void { super.ngAfterContentInit(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements AfterContentInit {}`,
    `import { AfterContentInit } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngAfterContentInit(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngAfterContentInit(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngAfterContentInit(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngAfterContentInit() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngAfterContentInit(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngAfterContentInit(): void; ngAfterContentInit(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngAfterContentInit(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngAfterContentInit(): void {} } class B { ngAfterContentInit(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements AfterContentInit, AfterContentChecked {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngAfterContentInit(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
  ],
});
