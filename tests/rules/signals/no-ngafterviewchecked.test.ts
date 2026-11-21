import * as rule from "../../../src/rules/signals/no-ngafterviewchecked.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgafterviewchecked";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngAfterViewInit(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngafterviewchecked(): void {} }`,
    `@Component() class A { NgAfterViewChecked(): void {} }`,
    `@Component() class A { ngAfterViewChecked2(): void {} }`,
    `@Component() class A { myNgAfterViewChecked(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // An arrow function property is not a lifecycle hook: Angular only registers hooks defined on the class prototype
    `@Component() class A { ngAfterViewChecked = (): void => {}; }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngAfterViewChecked(): void {} }`,
    // A computed key with a variable is not the hook
    `@Component() class A { [ngAfterViewChecked](): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngAfterViewChecked(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngAfterViewChecked(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngAfterViewChecked() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngAfterViewChecked();`,
    `class A extends B { foo(): void { super.ngAfterViewChecked(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements AfterViewChecked {}`,
    `import { AfterViewChecked } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngAfterViewChecked(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngAfterViewChecked(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngAfterViewChecked(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngAfterViewChecked() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngAfterViewChecked(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngAfterViewChecked(): void; ngAfterViewChecked(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngAfterViewChecked(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngAfterViewChecked(): void {} } class B { ngAfterViewChecked(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements AfterViewChecked, AfterViewInit {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngAfterViewChecked(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
    // Quoted and computed string keys define the same hook
    { code: `@Component() class A { 'ngAfterViewChecked'(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { ['ngAfterViewChecked'](): void {} }`, errors: [{ messageId }] },
  ],
});
