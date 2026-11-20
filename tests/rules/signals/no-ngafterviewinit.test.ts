import * as rule from "../../../src/rules/signals/no-ngafterviewinit.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgafterviewinit";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngAfterViewChecked(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngafterviewinit(): void {} }`,
    `@Component() class A { NgAfterViewInit(): void {} }`,
    `@Component() class A { ngAfterViewInit2(): void {} }`,
    `@Component() class A { myNgAfterViewInit(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // SUSPECTED BUG: a hook defined as an arrow function property is still called by Angular, but is not reported
    `@Component() class A { ngAfterViewInit = (): void => {}; }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngAfterViewInit(): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngAfterViewInit(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngAfterViewInit(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngAfterViewInit() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngAfterViewInit();`,
    `class A extends B { foo(): void { super.ngAfterViewInit(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements AfterViewInit {}`,
    `import { AfterViewInit } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngAfterViewInit(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngAfterViewInit(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngAfterViewInit(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngAfterViewInit() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngAfterViewInit(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngAfterViewInit(): void; ngAfterViewInit(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngAfterViewInit(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngAfterViewInit(): void {} } class B { ngAfterViewInit(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements AfterViewInit, AfterViewChecked {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngAfterViewInit(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
    // Quoted and computed string keys define the same hook
    { code: `@Component() class A { 'ngAfterViewInit'(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { ['ngAfterViewInit'](): void {} }`, errors: [{ messageId }] },
  ],
});
