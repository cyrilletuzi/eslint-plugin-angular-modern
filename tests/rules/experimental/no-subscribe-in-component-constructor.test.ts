import * as rule from "../../../src/rules/experimental/no-subscribe-in-component-constructor.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noSubscribeInComponentConstructor" } as const;

testRule(rule, {
  valid: [
    /* Modern alternatives */
    `@Component() class A { readonly a = toSignal(this.obs, { initialValue: false }); }`,
    `@Component() class A { constructor() { this.resource = rxResource({ stream: () => this.api.get() }); } }`,
    /* `.subscribe()` in other methods of a component */
    `@Component() class A { ngOnInit() { this.obs.subscribe(); } }`,
    `@Component() class A { method() { this.obs.subscribe(); } }`,
    `@Component() class A { get value() { return this.obs.subscribe(); } }`,
    `@Component() class A { static create() { obs.subscribe(); } }`,
    // SUSPECTED BUG: field initializers run during construction too, but are not in a constructor MethodDefinition
    `@Component() class A { sub = this.obs.subscribe(); }`,
    /* `.subscribe()` in constructors of non-Component classes */
    `@Directive() class A { constructor() { this.obs.subscribe(); } }`,
    `@Injectable() class A { constructor() { this.obs.subscribe(); } }`,
    `@Service() class A { constructor() { this.obs.subscribe(); } }`,
    `@Pipe({ name: 'a' }) class A { constructor() { this.obs.subscribe(); } }`,
    `@NgModule({}) class A { constructor() { this.obs.subscribe(); } }`,
    `class A { constructor() { this.obs.subscribe(); } }`,
    `@Foo() class A { constructor() { this.obs.subscribe(); } }`,
    /* Member expression decorator is not recognized */
    `@ng.Component() class A { constructor() { this.obs.subscribe(); } }`,
    /* Outside any class */
    `obs.subscribe();`,
    `function f() { obs.subscribe(); }`,
    /* Method of a class expression inside the constructor: nearest MethodDefinition is not the constructor */
    `@Component() class A { constructor() { const B = class { method() { obs.subscribe(); } }; } }`,
    /* Undecorated class declared inside the component constructor: nearest ClassDeclaration is not the component */
    `@Component() class A { constructor() { class B { constructor() { obs.subscribe(); } } } }`,
    /* Computed access is not matched */
    `@Component() class A { constructor() { this.obs['subscribe'](); } }`,
    /* `subscribe` not called (parent is not a CallExpression) */
    `@Component() class A { constructor() { const s = this.obs.subscribe; } }`,
    `@Component() class A { constructor() { this.obs.subscribe.bind(this.obs); } }`,
    /* Plain `subscribe()` function call (callee is an Identifier) */
    `@Component() class A { constructor() { subscribe(obs); } }`,
    /* Look-alike method names */
    `@Component() class A { constructor() { this.obs.subscribeTo(); this.obs.unsubscribe(); this.obs.Subscribe(); } }`,
    /* `subscribe` as the object of a member call */
    `@Component() class A { constructor() { subscribe.call(this); } }`,
  ],
  invalid: [
    /* Basic case */
    { code: `@Component() class A { constructor() { this.obs.subscribe(); } }`, errors: [error] },
    /* Component without call */
    { code: `@Component class A { constructor() { obs.subscribe(); } }`, errors: [error] },
    /* Component among other decorators */
    { code: `@Foo() @Component({}) export class A { constructor() { obs.subscribe(); } }`, errors: [error] },
    /* With pipe and observer */
    {
      code: `@Component() class A { constructor() { this.api.get().pipe(takeUntilDestroyed()).subscribe({ next: (v) => this.v.set(v) }); } }`,
      errors: [error],
    },
    /* Private field and local variable */
    { code: `@Component() class A { readonly #obs = inject(O); constructor() { this.#obs.subscribe((v) => {}); } }`, errors: [error] },
    { code: `@Component() class A { constructor() { const obs = inject(O).obs; obs.subscribe(); } }`, errors: [error] },
    /* Optional chaining */
    { code: `@Component() class A { constructor() { this.obs?.subscribe(); } }`, errors: [error] },
    { code: `@Component() class A { constructor() { this.obs.subscribe?.(); } }`, errors: [error] },
    /* Nested in callbacks, blocks, object methods inside the constructor */
    { code: `@Component() class A { constructor() { effect(() => { obs.subscribe(); }); } }`, errors: [error] },
    { code: `@Component() class A { constructor() { setTimeout(function () { obs.subscribe(); }); } }`, errors: [error] },
    { code: `@Component() class A { constructor() { if (a) { obs.subscribe(); } } }`, errors: [error] },
    { code: `@Component() class A { constructor() { const o = { m() { obs.subscribe(); } }; } }`, errors: [error] },
    /* Nested subscribe calls */
    {
      code: `@Component() class A { constructor() { a.subscribe(() => { b.subscribe(); }); } }`,
      errors: [error, error],
    },
    // SUSPECTED BUG: `CallExpression > MemberExpression` also matches a `.subscribe` reference passed as an argument (not a call)
    { code: `@Component() class A { constructor() { foo(this.obs.subscribe); } }`, errors: [error] },
    /* Any `.subscribe()` method is matched, even on non-observables */
    { code: `@Component() class A { constructor() { this.store.subscribe(() => {}); } }`, errors: [error] },
    /* Component class nested inside another context */
    { code: `function f() { @Component() class A { constructor() { obs.subscribe(); } } }`, errors: [error] },
  ],
});
