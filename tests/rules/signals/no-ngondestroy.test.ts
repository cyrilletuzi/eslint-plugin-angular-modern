import * as rule from "../../../src/rules/signals/no-ngondestroy.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgondestroy";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngOnInit(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngondestroy(): void {} }`,
    `@Component() class A { NgOnDestroy(): void {} }`,
    `@Component() class A { ngOnDestroy2(): void {} }`,
    `@Component() class A { myNgOnDestroy(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // SUSPECTED BUG: a hook defined as an arrow function property is still called by Angular, but is not reported
    `@Component() class A { ngOnDestroy = (): void => {}; }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngOnDestroy(): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngOnDestroy(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngOnDestroy(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngOnDestroy() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngOnDestroy();`,
    `class A extends B { foo(): void { super.ngOnDestroy(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements OnDestroy {}`,
    `import { OnDestroy } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngOnDestroy(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngOnDestroy(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngOnDestroy(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngOnDestroy() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngOnDestroy(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngOnDestroy(): void; ngOnDestroy(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngOnDestroy(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngOnDestroy(): void {} } class B { ngOnDestroy(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements OnDestroy, OnInit {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngOnDestroy(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
    // Quoted and computed string keys define the same hook
    { code: `@Component() class A { 'ngOnDestroy'(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { ['ngOnDestroy'](): void {} }`, errors: [{ messageId }] },
  ],
});
