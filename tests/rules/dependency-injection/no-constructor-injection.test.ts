import * as rule from "../../../src/rules/dependency-injection/no-constructor-injection.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noConstructorInjection" } as const;

testRule(rule, {
  valid: [
    /* Constructor without parameters in Angular classes */
    `import { Component } from "@angular/core"; @Component() class A { constructor() {} }`,
    `import { Directive } from "@angular/core"; @Directive() class A { constructor() { this.a = inject(A); } }`,
    `import { Pipe } from "@angular/core"; @Pipe({ name: 'a' }) class A { constructor() {} }`,
    `import { Injectable } from "@angular/core"; @Injectable() class A { constructor() {} }`,
    /* No constructor at all */
    `import { Component } from "@angular/core"; @Component() class A { a = inject(A); }`,
    /* Non-constructor methods with parameters */
    `import { Component } from "@angular/core"; @Component() class A { method(a: A) {} }`,
    `import { Component } from "@angular/core"; @Component() class A { set value(a: A) {} }`,
    `import { Component } from "@angular/core"; @Component() class A { static create(a: A) {} }`,
    /* Classes without decorator */
    `class A { constructor(a: A) {} }`,
    `class A { constructor(private readonly a: A) {} }`,
    /* Non-Angular decorators */
    `@Foo() class A { constructor(a: A) {} }`,
    `@Foo class A { constructor(a: A) {} }`,
    /* Look-alike decorator names */
    `@Components() class A { constructor(a: A) {} }`,
    `@component() class A { constructor(a: A) {} }`,
    /* Angular decorators not in the allowed list */
    // `@Service()` does not need to be checked: the Angular compiler already forbids constructor injection there
    `import { Service } from "@angular/core"; @Service() class A { constructor(a: A) {} }`,
    // `@NgModule()` is not checked, as the NgModule itself is already reported by `no-ngmodule`
    `import { NgModule } from "@angular/core"; @NgModule({}) class A { constructor(a: A) {} }`,
    /* Member expression decorators are not recognized */
    `@ng.Component() class A { constructor(a: A) {} }`,
    /* Nearest class is used: undecorated class nested in an Angular class */
    `import { Component } from "@angular/core"; @Component() class A { method() { class B { constructor(b: B) {} } } }`,
    /* Class expressions are not ClassDeclaration, so the nearest decorated ClassDeclaration is searched */
    `const A = class { constructor(a: A) {} };`,
    // ACCEPTED FALSE NEGATIVE: a decorated class expression is not detected, only class declarations are (not used in Angular code)
    `import { Component } from "@angular/core"; const A = @Component() class { constructor(a: A) {} };`,
    /* Constructor function outside a class */
    `function A(a: A) {}`,
    // Same decorator name from another library: NestJS relies on constructor injection
    `import { Injectable } from '@nestjs/common'; @Injectable() export class A { constructor(private readonly b: B) {} }`,
    // Angular decorator used without import is not checked
    `@Component({}) export class A { constructor(private readonly b: B) {} }`,
  ],
  invalid: [
    /* Each allowed decorator, with call */
    { code: `import { Component } from "@angular/core"; @Component({}) class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Directive } from "@angular/core"; @Directive({}) class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Pipe } from "@angular/core"; @Pipe({ name: 'a' }) class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Injectable } from "@angular/core"; @Injectable({ providedIn: 'root' }) class A { constructor(a: A) {} }`, errors: [error] },
    /* Each allowed decorator, without call */
    { code: `import { Component } from "@angular/core"; @Component class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Directive } from "@angular/core"; @Directive class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Pipe } from "@angular/core"; @Pipe class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Injectable } from "@angular/core"; @Injectable class A { constructor(a: A) {} }`, errors: [error] },
    /* Parameter properties */
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor(private readonly a: A) {} }`, errors: [error] },
    /* Parameters with `@Inject()` / `@Optional()` */
    { code: `import { Injectable } from "@angular/core"; @Injectable() class A { constructor(@Inject(TOKEN) a: string, @Optional() b?: B) {} }`, errors: [error] },
    /* Untyped, default and rest parameters */
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor(a) {} }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor(a = 1) {} }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor(...args: unknown[]) {} }`, errors: [error] },
    /* Several parameters: only one error per constructor */
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor(a: A, b: B, c: C) {} }`, errors: [error] },
    /* Angular decorator among other decorators */
    { code: `import { Component } from "@angular/core"; @Foo() @Component() @Bar class A { constructor(a: A) {} }`, errors: [error] },
    /* Exported, default exported (anonymous) and abstract classes */
    { code: `import { Component } from "@angular/core"; export @Component() class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() export class A { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Injectable } from "@angular/core"; @Injectable() export default class { constructor(a: A) {} }`, errors: [error] },
    { code: `import { Injectable } from "@angular/core"; @Injectable() abstract class A { constructor(a: A) {} }`, errors: [error] },
    /* Class extending another one */
    { code: `import { Component } from "@angular/core"; @Component() class A extends B { constructor(a: A) { super(a); } }`, errors: [error] },
    /* Angular class nested in an undecorated context */
    { code: `import { Injectable } from "@angular/core"; function f() { @Injectable() class A { constructor(a: A) {} } }`, errors: [error] },
    /* Constructor overload signatures are MethodDefinitions too */
    {
      code: `import { Injectable } from "@angular/core"; @Injectable() class A { constructor(a: A); constructor(a?: A) {} }`,
      errors: [error, error],
    },
    /* Several Angular classes in a file */
    {
      code: `import { Component, Injectable } from "@angular/core";


        @Component() class A { constructor(a: A) {} }
        @Injectable() class B { constructor(b: B) {} }
      `,
      errors: [error, error],
    },
    // Aliased Angular decorator is checked
    { code: `import { Component as NgComponent } from '@angular/core'; @NgComponent({}) export class A { constructor(private readonly b: B) {} }`, errors: [error] },
  ],
});
