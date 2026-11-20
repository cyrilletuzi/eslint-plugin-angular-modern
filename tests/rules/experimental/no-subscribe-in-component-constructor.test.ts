import * as rule from "../../../src/rules/experimental/no-subscribe-in-component-constructor.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noSubscribeInComponentConstructor" } as const;

testRule(rule, {
  valid: [
    /* Modern alternatives */
    `import { Component } from "@angular/core"; @Component() class A { readonly a = toSignal(this.obs, { initialValue: false }); }`,
    `import { Component } from "@angular/core"; @Component() class A { constructor() { this.resource = rxResource({ stream: () => this.api.get() }); } }`,
    /* `.subscribe()` in other methods of a component */
    `import { Component } from "@angular/core"; @Component() class A { ngOnInit() { this.obs.subscribe(); } }`,
    `import { Component } from "@angular/core"; @Component() class A { method() { this.obs.subscribe(); } }`,
    `import { Component } from "@angular/core"; @Component() class A { get value() { return this.obs.subscribe(); } }`,
    `import { Component } from "@angular/core"; @Component() class A { static create() { obs.subscribe(); } }`,
    // SUSPECTED BUG: field initializers run during construction too, but are not in a constructor MethodDefinition
    `import { Component } from "@angular/core"; @Component() class A { sub = this.obs.subscribe(); }`,
    /* `.subscribe()` in constructors of non-Component classes */
    `import { Directive } from "@angular/core"; @Directive() class A { constructor() { this.obs.subscribe(); } }`,
    `import { Injectable } from "@angular/core"; @Injectable() class A { constructor() { this.obs.subscribe(); } }`,
    `import { Service } from "@angular/core"; @Service() class A { constructor() { this.obs.subscribe(); } }`,
    `import { Pipe } from "@angular/core"; @Pipe({ name: 'a' }) class A { constructor() { this.obs.subscribe(); } }`,
    `import { NgModule } from "@angular/core"; @NgModule({}) class A { constructor() { this.obs.subscribe(); } }`,
    `class A { constructor() { this.obs.subscribe(); } }`,
    `@Foo() class A { constructor() { this.obs.subscribe(); } }`,
    /* Member expression decorator is not recognized */
    `@ng.Component() class A { constructor() { this.obs.subscribe(); } }`,
    /* Outside any class */
    `obs.subscribe();`,
    `function f() { obs.subscribe(); }`,
    /* Method of a class expression inside the constructor: nearest MethodDefinition is not the constructor */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { const B = class { method() { obs.subscribe(); } }; } }`,
    /* Undecorated class declared inside the component constructor: nearest ClassDeclaration is not the component */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { class B { constructor() { obs.subscribe(); } } } }`,
    /* `subscribe` not called (parent is not a CallExpression) */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { const s = this.obs.subscribe; } }`,
    `import { Component } from "@angular/core"; @Component() class A { constructor() { this.obs.subscribe.bind(this.obs); } }`,
    /* Plain `subscribe()` function call (callee is an Identifier) */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { subscribe(obs); } }`,
    /* Look-alike method names */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { this.obs.subscribeTo(); this.obs.unsubscribe(); this.obs.Subscribe(); } }`,
    /* `subscribe` as the object of a member call */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { subscribe.call(this); } }`,
    /* Same decorator name from another library (Stencil) */
    `import { Component } from '@stencil/core'; @Component({ tag: 'my-a' }) export class A { constructor() { obs.subscribe(); } }`,
    /* Angular decorator used without import is not checked */
    `@Component({}) export class A { constructor() { obs.subscribe(); } }`,
    /* A `.subscribe` reference passed as an argument is not a call */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { foo(this.obs.subscribe); } }`,
    /* ACCEPTED FALSE NEGATIVE: computed access with a string is not reported (unnecessary computed access, already flagged by `dot-notation`) */
    `import { Component } from "@angular/core"; @Component() class A { constructor() { this.obs['subscribe'](); } }`,
  ],
  invalid: [
    /* Basic case */
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { this.obs.subscribe(); } }`, errors: [error] },
    /* Component without call */
    { code: `import { Component } from "@angular/core"; @Component class A { constructor() { obs.subscribe(); } }`, errors: [error] },
    /* Component among other decorators */
    { code: `import { Component } from "@angular/core"; @Foo() @Component({}) export class A { constructor() { obs.subscribe(); } }`, errors: [error] },
    /* With pipe and observer */
    {
      code: `import { Component } from "@angular/core"; @Component() class A { constructor() { this.api.get().pipe(takeUntilDestroyed()).subscribe({ next: (v) => this.v.set(v) }); } }`,
      errors: [error],
    },
    /* Private field and local variable */
    { code: `import { Component } from "@angular/core"; @Component() class A { readonly #obs = inject(O); constructor() { this.#obs.subscribe((v) => {}); } }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { const obs = inject(O).obs; obs.subscribe(); } }`, errors: [error] },
    /* Optional chaining */
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { this.obs?.subscribe(); } }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { this.obs.subscribe?.(); } }`, errors: [error] },
    /* Nested in callbacks, blocks, object methods inside the constructor */
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { effect(() => { obs.subscribe(); }); } }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { setTimeout(function () { obs.subscribe(); }); } }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { if (a) { obs.subscribe(); } } }`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { const o = { m() { obs.subscribe(); } }; } }`, errors: [error] },
    /* Nested subscribe calls */
    {
      code: `import { Component } from "@angular/core"; @Component() class A { constructor() { a.subscribe(() => { b.subscribe(); }); } }`,
      errors: [error, error],
    },
    /* Any `.subscribe()` method is matched, even on non-observables */
    { code: `import { Component } from "@angular/core"; @Component() class A { constructor() { this.store.subscribe(() => {}); } }`, errors: [error] },
    /* Component class nested inside another context */
    { code: `import { Component } from "@angular/core"; function f() { @Component() class A { constructor() { obs.subscribe(); } } }`, errors: [error] },
    /* Aliased Angular decorator is checked */
    { code: `import { Component as NgComponent } from '@angular/core'; @NgComponent({}) export class A { constructor() { obs.subscribe(); } }`, errors: [error] },
  ],
});
