import * as rule from "../../../src/rules/signals/no-directive-accessor.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noDirectiveAccessor";

testRule(rule, {
  valid: [
    // Doc example: `computed()` instead
    `
      @Component({ template: \`{{ count() }}\` })
      export class Products {
        private readonly products = signal<readonly string[]>([]);
        count = computed<number>(() => this.products().length);
      }
    `,
    // Native private accessors (`PrivateIdentifier` key)
    `@Component() class A { get #name(): string { return "Elmo"; } }`,
    `@Directive() class A { set #name(value: string) {} }`,
    // Regular methods and constructor (`kind` is `method` / `constructor`)
    `@Component() class A { constructor() {} count(): number { return 1; } }`,
    // Methods named `get` / `set`
    `@Component() class A { get(): void {} set(): void {} }`,
    // Accessors in classes which are not components or directives
    `class A { get a() { return 1; } set a(value: number) {} }`,
    `@Injectable() class A { get a() { return 1; } }`,
    `@Pipe({ name: "a" }) class A { get a() { return 1; } }`,
    `@NgModule() class A { get a() { return 1; } }`,
    `@Service() class A { get a() { return 1; } }`,
    `@Foo() class A { get a() { return 1; } }`,
    // Look-alike decorator names
    `@component() class A { get a() { return 1; } }`,
    `@MyComponent() class A { get a() { return 1; } }`,
    // Object literal accessors (`Property`, not `MethodDefinition`) inside a component
    `@Component() class A { readonly a = { get b() { return 1; } }; }`,
    // Abstract accessor (`TSAbstractMethodDefinition`)
    `@Directive() abstract class A { abstract get a(): number; }`,
    // Interface accessor signature (`TSMethodSignature`)
    `interface A { get a(): number; set a(value: number); }`,
    // Auto-accessor (`AccessorProperty`)
    `@Component() class A { accessor a = 1; }`,
    // Nested plain class declaration inside a component method: the nearest `ClassDeclaration` is not Angular
    `@Component() class A { m() { class B { get a() { return 1; } } } }`,
    // Decorated class expression: only `ClassDeclaration` is looked up
    // SUSPECTED BUG: a component defined as a class expression is not checked
    `const A = @Component() class { get a() { return 1; } };`,
    // Decorator callee is a `MemberExpression`
    // SUSPECTED BUG: `@core.Component()` (namespace import) is not recognized as a component
    `@core.Component() class A { get a() { return 1; } }`,
  ],
  invalid: [
    // Doc example: getter in a component
    {
      code: `
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
    { code: `@Component() class A { set count(value: number) {} }`, errors: [{ messageId }] },
    // Access modifiers
    { code: `@Component() class A { public get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `@Component() class A { protected get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `@Component() class A { private get a() { return 1; } }`, errors: [{ messageId }] },
    // Static and override accessors
    { code: `@Component() class A { static get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `@Component() class A extends B { override get a() { return 1; } }`, errors: [{ messageId }] },
    // String literal and computed keys
    { code: `@Component() class A { get "a"() { return 1; } }`, errors: [{ messageId }] },
    { code: `@Component() class A { get [key]() { return 1; } }`, errors: [{ messageId }] },
    // Decorated accessor (e.g. `@Input()` setter)
    { code: `@Directive() class A { @Input() set a(value: string) {} }`, errors: [{ messageId }] },
    // Directive
    { code: `@Directive() class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Decorator without call (`Identifier` branch)
    { code: `@Component class A { get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `@Directive class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Angular decorator among others
    { code: `@Foo() @Component() class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Exported classes
    { code: `@Component() export class A { get a() { return 1; } }`, errors: [{ messageId }] },
    { code: `@Component() export default class A { get a() { return 1; } }`, errors: [{ messageId }] },
    // Getter and setter pair: one report each
    { code: `@Component() class A { get a() { return 1; } set a(value: number) {} }`, errors: [{ messageId }, { messageId }] },
    // Class expression nested in a component: the nearest `ClassDeclaration` is the component
    // SUSPECTED BUG: an accessor of an unrelated inner class expression is reported
    { code: `@Component() class A { readonly b = class { get c() { return 1; } }; }`, errors: [{ messageId }] },
  ],
});
