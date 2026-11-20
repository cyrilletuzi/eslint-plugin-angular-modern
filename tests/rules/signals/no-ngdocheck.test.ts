import * as rule from "../../../src/rules/signals/no-ngdocheck.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgdocheck";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngOnInit(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngdocheck(): void {} }`,
    `@Component() class A { NgDoCheck(): void {} }`,
    `@Component() class A { ngDoCheck2(): void {} }`,
    `@Component() class A { myNgDoCheck(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // SUSPECTED BUG: a hook defined as an arrow function property is still called by Angular, but is not reported
    `@Component() class A { ngDoCheck = (): void => {}; }`,
    // Only an `Identifier` key is targeted: string literal and computed keys are ignored
    // SUSPECTED BUG: `'ngDoCheck'()` and `['ngDoCheck']()` define the same hook, but are not reported
    `@Component() class A { 'ngDoCheck'(): void {} }`,
    `@Component() class A { ['ngDoCheck'](): void {} }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngDoCheck(): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngDoCheck(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngDoCheck(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngDoCheck() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngDoCheck();`,
    `class A extends B { foo(): void { super.ngDoCheck(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements DoCheck {}`,
    `import { DoCheck } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngDoCheck(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngDoCheck(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngDoCheck(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngDoCheck(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngDoCheck(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngDoCheck(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngDoCheck(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngDoCheck(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngDoCheck(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngDoCheck(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngDoCheck(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngDoCheck() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngDoCheck(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngDoCheck(): void; ngDoCheck(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngDoCheck(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngDoCheck(): void {} } class B { ngDoCheck(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements DoCheck, OnInit {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngDoCheck(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
  ],
});
