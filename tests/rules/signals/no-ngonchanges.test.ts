import * as rule from "../../../src/rules/signals/no-ngonchanges.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noNgonchanges";

testRule(rule, {
  valid: [
    // No lifecycle method at all
    `@Component() class A { readonly a = signal(1); }`,
    // Another lifecycle hook name must not match
    `@Component() class A { ngOnInit(): void {} }`,
    // Look-alike names (case and prefix/suffix variations)
    `@Component() class A { ngonchanges(): void {} }`,
    `@Component() class A { NgOnChanges(): void {} }`,
    `@Component() class A { ngOnChanges2(): void {} }`,
    `@Component() class A { myNgOnChanges(): void {} }`,
    // Only `MethodDefinition` is targeted: a property holding an arrow function is ignored
    // SUSPECTED BUG: a hook defined as an arrow function property is still called by Angular, but is not reported
    `@Component() class A { ngOnChanges = (): void => {}; }`,
    // Only an `Identifier` key is targeted: string literal and computed keys are ignored
    // SUSPECTED BUG: `'ngOnChanges'()` and `['ngOnChanges']()` define the same hook, but are not reported
    `@Component() class A { 'ngOnChanges'(): void {} }`,
    `@Component() class A { ['ngOnChanges'](): void {} }`,
    // A native private method (`PrivateIdentifier` key) is a different member, not a hook
    `@Component() class A { #ngOnChanges(): void {} }`,
    // Abstract method (`TSAbstractMethodDefinition`) is not targeted
    `abstract class A { abstract ngOnChanges(): void; }`,
    // Interface method signature (`TSMethodSignature`) is not targeted
    `interface A { ngOnChanges(): void; }`,
    // Object literal method (`Property`) is not targeted
    `const a = { ngOnChanges() {} };`,
    // Calling the method is not targeted, only defining it
    `a.ngOnChanges();`,
    `class A extends B { foo(): void { super.ngOnChanges(); } }`,
    // Implementing the interface without the method is not reported
    `@Component() class A implements OnChanges {}`,
    `import { OnChanges } from "@angular/core";`,
  ],
  invalid: [
    // Method in a component
    { code: `@Component() class A { ngOnChanges(): void {} }`, errors: [{ messageId }] },
    // Method in a directive
    { code: `@Directive() class A { ngOnChanges(): void {} }`, errors: [{ messageId }] },
    // With an access modifier, `async`, `static`, `override`
    { code: `@Component() class A { public ngOnChanges(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected ngOnChanges(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { private ngOnChanges(): void {} }`, errors: [{ messageId }] },
    { code: `@Component() class A { async ngOnChanges(): Promise<void> {} }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override ngOnChanges(): void {} }`, errors: [{ messageId }] },
    { code: `class A { static ngOnChanges(): void {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes: any class declaration or expression
    { code: `class A { ngOnChanges(): void {} }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { ngOnChanges(): void {} }`, errors: [{ messageId }] },
    { code: `const A = class { ngOnChanges(): void {} };`, errors: [{ messageId }] },
    // Accessors are `MethodDefinition` too
    { code: `class A { get ngOnChanges() { return 1; } }`, errors: [{ messageId }] },
    { code: `class A { set ngOnChanges(value: number) {} }`, errors: [{ messageId }] },
    // Overload signatures are `MethodDefinition` (with an empty body): each one is reported
    { code: `class A { ngOnChanges(): void; ngOnChanges(a?: number): void {} }`, errors: [{ messageId }, { messageId }] },
    // Nested class inside a method
    { code: `@Component() class A { foo(): void { class B { ngOnChanges(): void {} } } }`, errors: [{ messageId }] },
    // One report per occurrence
    { code: `class A { ngOnChanges(): void {} } class B { ngOnChanges(): void {} }`, errors: [{ messageId }, { messageId }] },
    // Doc-like example
    {
      code: `
        @Component()
        export class ProductsList implements OnChanges, OnInit {
          readonly list = input.required<readonly Product[]>();
          protected count = 0;

          ngOnChanges(): void {
            this.count = this.list().length;
          }
        }
      `,
      errors: [{ messageId }],
    },
  ],
});
