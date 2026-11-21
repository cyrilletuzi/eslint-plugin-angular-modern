import * as rule from "../../../src/rules/signals/no-directive-accessor.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noDirectiveAccessor";

testRule(rule, {
  valid: [
    // Doc example: `computed()` instead
    `import { Component } from "@angular/core";


      @Component({ template: \`{{ count() }}\` })
      export class Products {
        private readonly products = signal<readonly string[]>([]);
        count = computed<number>(() => this.products().length);
      }
    `,
    // Native private accessors (`PrivateIdentifier` key)
    `import { Component } from "@angular/core"; @Component() class A { get #name(): string { return "Elmo"; } }`,
    `import { Directive } from "@angular/core"; @Directive() class A { set #name(value: string) {} }`,
    // Regular methods and constructor (`kind` is `method` / `constructor`)
    `import { Component } from "@angular/core"; @Component() class A { constructor() {} count(): number { return 1; } }`,
    // Methods named `get` / `set`
    `import { Component } from "@angular/core"; @Component() class A { get(): void {} set(): void {} }`,
    // Accessors in classes which are not components or directives
    `class A { get a() { return 1; } set a(value: number) {} }`,
    `import { Injectable } from "@angular/core"; @Injectable() class A { get a() { return 1; } }`,
    `import { Pipe } from "@angular/core"; @Pipe({ name: "a" }) class A { get a() { return 1; } }`,
    `import { NgModule } from "@angular/core"; @NgModule() class A { get a() { return 1; } }`,
    `import { Service } from "@angular/core"; @Service() class A { get a() { return 1; } }`,
    `@Foo() class A { get a() { return 1; } }`,
    // Look-alike decorator names
    `@component() class A { get a() { return 1; } }`,
    `@MyComponent() class A { get a() { return 1; } }`,
    // Object literal accessors (`Property`, not `MethodDefinition`) inside a component
    `import { Component } from "@angular/core"; @Component() class A { readonly a = { get b() { return 1; } }; }`,
    // Abstract accessor (`TSAbstractMethodDefinition`)
    `import { Directive } from "@angular/core"; @Directive() abstract class A { abstract get a(): number; }`,
    // Interface accessor signature (`TSMethodSignature`)
    `interface A { get a(): number; set a(value: number); }`,
    // Auto-accessor (`AccessorProperty`)
    `import { Component } from "@angular/core"; @Component() class A { accessor a = 1; }`,
    // Nested plain class declaration inside a component method: the nearest `ClassDeclaration` is not Angular
    `import { Component } from "@angular/core"; @Component() class A { m() { class B { get a() { return 1; } } } }`,
    // Decorated class expression: only `ClassDeclaration` is looked up
    // ACCEPTED FALSE NEGATIVE: a decorated class expression is not detected, only class declarations are (not used in Angular code)
    `import { Component } from "@angular/core"; const A = @Component() class { get a() { return 1; } };`,
    // Decorator callee is a `MemberExpression`
    // ACCEPTED FALSE NEGATIVE: `@core.Component()` (namespace import) is not recognized as a component
    `@core.Component() class A { get a() { return 1; } }`,
    // Same decorator name from another library (Stencil)
    `import { Component } from '@stencil/core'; @Component({ tag: 'my-a' }) export class A { get value() { return 1; } }`,
    // Angular decorator used without import is not checked
    `@Component({}) export class A { get value() { return 1; } }`,
  ],
  invalid: [
    // Doc example: getter in a component
    {
      code: `import { Component } from "@angular/core";


        @Component({ template: \`{{ count }}\` })
        export class Products {
          private products = [];

          get count(): number {
            return this.products.length;
          }
        }
      `,
      errors: [{ messageId }],
    },
    // Setter
    { code: `import { Component } from "@angular/core"; @Component() class A { set count(value: number) {} }`, errors: [{ messageId }] },
    // Access modifiers
    { code: `import { Component } from "@angular/core"; @Component() class A { public get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { protected get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { private get a() { return 1; } }`, errors: [{ messageId }] },
    // Static and override accessors
    { code: `import { Component } from "@angular/core"; @Component() class A { static get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A extends B { override get a() { return 1; } }`, errors: [{ messageId }] },
    // String literal and computed keys
    { code: `import { Component } from "@angular/core"; @Component() class A { get "a"() { return 1; } }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { get [key]() { return 1; } }`, errors: [{ messageId }] },
    // Decorated accessor (e.g. `@Input()` setter)
    { code: `import { Directive } from "@angular/core"; @Directive() class A { @Input() set a(value: string) {} }`, errors: [{ messageId }] },
    // Directive
    { code: `import { Directive } from "@angular/core"; @Directive() class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Decorator without call (`Identifier` branch)
    { code: `import { Component } from "@angular/core"; @Component class A { get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `import { Directive } from "@angular/core"; @Directive class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Angular decorator among others
    { code: `import { Component } from "@angular/core"; @Foo() @Component() class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Exported classes
    { code: `import { Component } from "@angular/core"; @Component() export class A { get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() export default class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Getter and setter pair: one report each
    { code: `import { Component } from "@angular/core"; @Component() class A { get a() { return 1; } set a(value: number) {} }`, errors: [{ messageId }, { messageId }] },
    // Class expression nested in a component: the nearest `ClassDeclaration` is the component
    // ACCEPTED FALSE POSITIVE: an accessor of an unrelated inner class expression is reported (not used in Angular code)
    { code: `import { Component } from "@angular/core"; @Component() class A { readonly b = class { get c() { return 1; } }; }`, errors: [{ messageId }] },
    // Aliased Angular decorator is checked
    { code: `import { Directive as NgDirective } from '@angular/core'; @NgDirective() export class A { get value() { return 1; } }`, errors: [{ messageId }] },
  ],
});
