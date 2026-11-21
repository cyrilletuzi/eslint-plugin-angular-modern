import * as rule from "../../../src/rules/signals/no-ngaftercontentchecked.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgaftercontentchecked";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngAfterContentInit(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngaftercontentchecked(): void {} }`,
    `@Component() class A { NgAfterContentChecked(): void {} }`,
    `@Component() class A { ngAfterContentChecked2(): void {} }`,
    `@Component() class A { myNgAfterContentChecked(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // An arrow function property is not a lifecycle hook: Angular only registers hooks defined on the class prototype
    `@Component() class A { ngAfterContentChecked = (): void => {}; }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngAfterContentChecked(): void {} }`,
    // A computed key with a variable is not the hook
    `@Component() class A { [ngAfterContentChecked](): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngAfterContentChecked(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngAfterContentChecked(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngAfterContentChecked() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngAfterContentChecked();`,
    `class A extends B { foo(): void { super.ngAfterContentChecked(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements AfterContentChecked {}`,
    `import { AfterContentChecked } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngAfterContentChecked(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngAfterContentChecked(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngAfterContentChecked(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngAfterContentChecked() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngAfterContentChecked(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngAfterContentChecked(): void; ngAfterContentChecked(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngAfterContentChecked(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngAfterContentChecked(): void {} } class B { ngAfterContentChecked(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements AfterContentChecked, AfterContentInit {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngAfterContentChecked(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
    // Quoted and computed string keys define the same hook
    { code: `@Component() class A { 'ngAfterContentChecked'(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { ['ngAfterContentChecked'](): void {} }`, errors: [{ messageId }] },
  ],
});
