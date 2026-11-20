import * as rule from "../../../src/rules/signals/no-directive-writable-property.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noDirectiveWritableProperty";

testRule(rule, {
  valid: [
    // Doc examples: `readonly` with every access modifier
    `import { Component } from "@angular/core"; @Component({ template: \`{{ name() }}\` }) export class Profile { readonly name = signal("Elmo"); }`,
    `import { Component } from "@angular/core"; @Component() class A { public readonly name = signal("Elmo"); }`,
    `import { Component } from "@angular/core"; @Component() class A { protected readonly name = signal("Elmo"); }`,
    `import { Component } from "@angular/core"; @Component() class A { private readonly name = signal("Elmo"); }`,
    `import { Directive } from "@angular/core"; @Directive() class A { readonly name = signal("Elmo"); }`,
    // Native private property (`PrivateIdentifier` key)
    `import { Component } from "@angular/core"; @Component() class A { #name = "Elmo"; change() { this.#name = "Cookie Monster"; } }`,
    `import { Directive } from "@angular/core"; @Directive() class A { static #name = "Elmo"; }`,
    // Other `readonly` combinations
    `import { Component } from "@angular/core"; @Component() class A { static readonly a = 1; }`,
    `import { Component } from "@angular/core"; @Component() class A { readonly a!: string; }`,
    `import { Component } from "@angular/core"; @Component() class A { declare readonly a: string; }`,
    `import { Component } from "@angular/core"; @Component() class A { readonly ["a"] = 1; }`,
    `import { Component } from "@angular/core"; @Component() class A extends B { override readonly a = 1; }`,
    // Methods and accessors are not `PropertyDefinition`
    `import { Component } from "@angular/core"; @Component() class A { m(): void {} get a() { return 1; } }`,
    // Writable properties in classes which are not components or directives
    `class A { a = 1; }`,
    `import { Injectable } from "@angular/core"; @Injectable() class A { a = 1; }`,
    `import { Pipe } from "@angular/core"; @Pipe({ name: "a" }) class A { a = 1; }`,
    `import { NgModule } from "@angular/core"; @NgModule() class A { a = 1; }`,
    `import { Service } from "@angular/core"; @Service() class A { a = 1; }`,
    `@Foo() class A { a = 1; }`,
    // Look-alike decorator names
    `@directive() class A { a = 1; }`,
    `@MyDirective() class A { a = 1; }`,
    // Object literal properties (`Property`) inside a component
    `import { Component } from "@angular/core"; @Component() class A { readonly a = { b: 1 }; }`,
    // Abstract property (`TSAbstractPropertyDefinition`)
    `import { Directive } from "@angular/core"; @Directive() abstract class A { abstract a: string; }`,
    // Index signature (`TSIndexSignature`)
    `import { Component } from "@angular/core"; @Component() class A { [key: string]: unknown; }`,
    // Auto-accessor (`AccessorProperty`)
    // SUSPECTED BUG: an auto-accessor is writable, but is not reported
    `import { Component } from "@angular/core"; @Component() class A { accessor a = 1; }`,
    // Constructor parameter property (`TSParameterProperty`)
    // SUSPECTED BUG: a writable parameter property is not reported
    `import { Component } from "@angular/core"; @Component() class A { constructor(public a: string) {} }`,
    // Nested plain class declaration inside a component method: the nearest `ClassDeclaration` is not Angular
    `import { Component } from "@angular/core"; @Component() class A { m() { class B { a = 1; } } }`,
    // Decorated class expression: only `ClassDeclaration` is looked up
    // SUSPECTED BUG: a component defined as a class expression is not checked
    `import { Component } from "@angular/core"; const A = @Component() class { a = 1; };`,
    // Decorator callee is a `MemberExpression`
    // ACCEPTED FALSE NEGATIVE: `@core.Component()` (namespace import) is not recognized as a component
    `@core.Component() class A { a = 1; }`,
    // Same decorator name from another library (Stencil)
    `import { Component, Prop } from '@stencil/core'; @Component({ tag: 'my-a' }) export class A { @Prop() name: string; }`,
    // Angular decorator used without import is not checked
    `@Component({}) export class A { name = ''; }`,
  ],
  invalid: [
    // Doc examples: every access modifier
    {
      code: `import { Component } from "@angular/core";


        @Component({ template: \`{{ name }}\` })
        export class Profile {
          name = "Elmo";

          change(): void {
            this.name = "Cookie Monster";
          }
        }
      `,
      errors: [{ messageId }],
    },
    { code: `import { Component } from "@angular/core"; @Component() class A { public name = "Elmo"; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { protected name = "Elmo"; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { private name = "Elmo"; }`, errors: [{ messageId }] },
    { code: `import { Directive } from "@angular/core"; @Directive() class A { name = "Elmo"; }`, errors: [{ messageId }] },
    // Static, override, declare, definite, optional, uninitialized
    { code: `import { Component } from "@angular/core"; @Component() class A { static a = 1; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A extends B { override a = 1; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { declare a: string; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { a!: string; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { a?: string; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { a; }`, errors: [{ messageId }] },
    // Holding a signal does not matter, only `readonly`
    { code: `import { Component } from "@angular/core"; @Component() class A { a = signal(1); }`, errors: [{ messageId }] },
    // Arrow function property
    { code: `import { Component } from "@angular/core"; @Component() class A { onClick = () => {}; }`, errors: [{ messageId }] },
    // String literal and computed keys
    { code: `import { Component } from "@angular/core"; @Component() class A { "a" = 1; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() class A { [key] = 1; }`, errors: [{ messageId }] },
    // Decorated property
    { code: `import { Component } from "@angular/core"; @Component() class A { @Input() a = ""; }`, errors: [{ messageId }] },
    // Decorator without call (`Identifier` branch)
    { code: `import { Component } from "@angular/core"; @Component class A { a = 1; }`, errors: [{ messageId }] },
    { code: `import { Directive } from "@angular/core"; @Directive class A { a = 1; }`, errors: [{ messageId }] },
    // Angular decorator among others
    { code: `import { Directive } from "@angular/core"; @Foo() @Directive() class A { a = 1; }`, errors: [{ messageId }] },
    // Exported classes
    { code: `import { Component } from "@angular/core"; @Component() export class A { a = 1; }`, errors: [{ messageId }] },
    { code: `import { Component } from "@angular/core"; @Component() export default class A { a = 1; }`, errors: [{ messageId }] },
    // One report per writable property, `readonly` and `#private` ones are skipped
    { code: `import { Component } from "@angular/core"; @Component() class A { a = 1; readonly b = 2; c = 3; #d = 4; }`, errors: [{ messageId }, { messageId }] },
    // Class expression nested in a component: the nearest `ClassDeclaration` is the component
    // SUSPECTED BUG: the outer property is writable (1 report) but a property of an unrelated inner class expression is reported too (1 report)
    { code: `import { Component } from "@angular/core"; @Component() class A { b = class { c = 1; }; }`, errors: [{ messageId }, { messageId }] },
    // Aliased Angular decorator is checked
    { code: `import { Component as NgComponent } from '@angular/core'; @NgComponent({}) export class A { name = ''; }`, errors: [{ messageId }] },
  ],
});
