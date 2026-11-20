import * as rule from "../../../src/rules/signals/no-detectchanges-testing.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noDetectchangesTesting";

testRule(rule, {
  valid: [
    // Doc example: `await fixture.whenStable()`
    `
      it("should...", async () => {
        const fixture = TestBed.createComponent(SomeComponent);
        await fixture.whenStable();
      });
    `,
    // Look-alike method names
    `fixture.detectchanges(); fixture.detectChangesNow(); fixture.checkNoChanges(); fixture.autoDetectChanges();`,
    // Not a member call
    `detectChanges();`,
    // Member access without call (parent is not a `CallExpression`)
    `const detect = fixture.detectChanges;`,
    `new Foo(fixture.detectChanges);`,
    /* A `.detectChanges` reference passed as an argument is not a call */
    `spyOn(fixture.detectChanges);`,
    // Computed access (`computed=true`)
    // SUSPECTED BUG: `fixture["detectChanges"]()` is not reported
    `fixture["detectChanges"]();`,
    `fixture[detectChanges]();`,
    // Native private method (`PrivateIdentifier` property)
    `class A { #detectChanges() {} m() { this.#detectChanges(); } }`,
    // `fixture.detectChanges` is the object of another member: its parent is a `MemberExpression`
    `fixture.detectChanges.call(fixture);`,
    // Inside a component or a directive (`ChangeDetectorRef.detectChanges()`)
    `@Component() class A { readonly #cdr = inject(ChangeDetectorRef); m() { this.#cdr.detectChanges(); } }`,
    `@Directive() class A { m() { this.cdr.detectChanges(); } }`,
    // Decorator without call (`Identifier` branch of `findAngularClassDecorator()`)
    `@Component class A { m() { this.cdr.detectChanges(); } }`,
    // Angular decorator among others
    `@Foo() @Component() class A { m() { this.cdr.detectChanges(); } }`,
    // Deeply nested inside a component class (callback, constructor, property initializer)
    `@Component() class A { constructor() { effect(() => { this.cdr.detectChanges(); }); } }`,
    `@Component() class A { readonly a = () => this.cdr.detectChanges(); }`,
    // Class expression nested in a component: the nearest `ClassDeclaration` is the component
    `@Component() class A { readonly b = class { m() { this.cdr.detectChanges(); } }; }`,
    // Component test host declared in a test file
    `describe("x", () => { @Component() class Host { m() { this.cdr.detectChanges(); } } });`,
  ],
  invalid: [
    // Doc example
    {
      code: `
        it("should...", () => {
          const fixture = TestBed.createComponent(SomeComponent);
          fixture.detectChanges();
        });
      `,
      errors: [{ messageId }],
    },
    // Top level, with argument
    { code: `fixture.detectChanges(false);`, errors: [{ messageId }] },
    // Any object
    { code: `fixture.componentRef.changeDetectorRef.detectChanges();`, errors: [{ messageId }] },
    { code: `this.fixture.detectChanges();`, errors: [{ messageId }] },
    // Optional chaining
    { code: `fixture?.detectChanges();`, errors: [{ messageId }] },
    { code: `fixture.detectChanges?.();`, errors: [{ messageId }] },
    // Chained after the call
    { code: `fixture.detectChanges().then();`, errors: [{ messageId }] },
    // One report per call
    { code: `fixture.detectChanges(); fixture.detectChanges();`, errors: [{ messageId }, { messageId }] },
    // Inside a non-component/directive class
    { code: `class A { m() { this.fixture.detectChanges(); } }`, errors: [{ messageId }] },
    { code: `@Injectable() class A { m() { this.cdr.detectChanges(); } }`, errors: [{ messageId }] },
    { code: `@NgModule() class A { m() { this.cdr.detectChanges(); } }`, errors: [{ messageId }] },
    // SUSPECTED BUG: a pipe can inject `ChangeDetectorRef`, but `detectChanges()` there is reported as a testing issue
    { code: `@Pipe({ name: "a" }) class A { transform() { this.cdr.detectChanges(); } }`, errors: [{ messageId }] },
    // Nested plain class declaration inside a component: the nearest `ClassDeclaration` is not Angular
    { code: `@Component() class A { m() { class B { n() { this.cdr.detectChanges(); } } } }`, errors: [{ messageId }] },
    // Decorated class expression: only `ClassDeclaration` is looked up
    // SUSPECTED BUG: a component defined as a class expression is not recognized
    { code: `const A = @Component() class { m() { this.cdr.detectChanges(); } };`, errors: [{ messageId }] },
    // Decorator callee is a `MemberExpression`
    // SUSPECTED BUG: `@core.Component()` (namespace import) is not recognized as a component
    { code: `@core.Component() class A { m() { this.cdr.detectChanges(); } }`, errors: [{ messageId }] },
    // The selector matches any `MemberExpression` child of a `CallExpression`, including arguments
  ],
});
