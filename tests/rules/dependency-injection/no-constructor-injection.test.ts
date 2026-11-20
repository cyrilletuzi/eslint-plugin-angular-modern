import * as rule from "../../../src/rules/dependency-injection/no-constructor-injection.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noConstructorInjection" } as const;

testRule(rule, {
  valid: [
    /* Constructor without parameters in Angular classes */
    `@Component() class A { constructor() {} }`,
    `@Directive() class A { constructor() { this.a = inject(A); } }`,
    `@Pipe({ name: 'a' }) class A { constructor() {} }`,
    `@Injectable() class A { constructor() {} }`,
    /* No constructor at all */
    `@Component() class A { a = inject(A); }`,
    /* Non-constructor methods with parameters */
    `@Component() class A { method(a: A) {} }`,
    `@Component() class A { set value(a: A) {} }`,
    `@Component() class A { static create(a: A) {} }`,
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
    // SUSPECTED BUG: constructor injection in a `@Service()` class is not reported, while `@Service()` is the modern replacement of `@Injectable()` and also supports DI
    `@Service() class A { constructor(a: A) {} }`,
    // SUSPECTED BUG: constructor injection in an `@NgModule()` class is not reported, while NgModule constructors also support DI
    `@NgModule({}) class A { constructor(a: A) {} }`,
    /* Member expression decorators are not recognized */
    `@ng.Component() class A { constructor(a: A) {} }`,
    /* Nearest class is used: undecorated class nested in an Angular class */
    `@Component() class A { method() { class B { constructor(b: B) {} } } }`,
    /* Class expressions are not ClassDeclaration, so the nearest decorated ClassDeclaration is searched */
    `const A = class { constructor(a: A) {} };`,
    // SUSPECTED BUG: a decorated class expression is not detected, only ClassDeclaration is searched (rare in Angular code)
    `const A = @Component() class { constructor(a: A) {} };`,
    /* Constructor function outside a class */
    `function A(a: A) {}`,
  ],
  invalid: [
    /* Each allowed decorator, with call */
    { code: `@Component({}) class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Directive({}) class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Pipe({ name: 'a' }) class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Injectable({ providedIn: 'root' }) class A { constructor(a: A) {} }`, errors: [error] },
    /* Each allowed decorator, without call */
    { code: `@Component class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Directive class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Pipe class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Injectable class A { constructor(a: A) {} }`, errors: [error] },
    /* Parameter properties */
    { code: `@Component() class A { constructor(private readonly a: A) {} }`, errors: [error] },
    /* Parameters with `@Inject()` / `@Optional()` */
    { code: `@Injectable() class A { constructor(@Inject(TOKEN) a: string, @Optional() b?: B) {} }`, errors: [error] },
    /* Untyped, default and rest parameters */
    { code: `@Component() class A { constructor(a) {} }`, errors: [error] },
    { code: `@Component() class A { constructor(a = 1) {} }`, errors: [error] },
    { code: `@Component() class A { constructor(...args: unknown[]) {} }`, errors: [error] },
    /* Several parameters: only one error per constructor */
    { code: `@Component() class A { constructor(a: A, b: B, c: C) {} }`, errors: [error] },
    /* Angular decorator among other decorators */
    { code: `@Foo() @Component() @Bar class A { constructor(a: A) {} }`, errors: [error] },
    /* Exported, default exported (anonymous) and abstract classes */
    { code: `export @Component() class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Component() export class A { constructor(a: A) {} }`, errors: [error] },
    { code: `@Injectable() export default class { constructor(a: A) {} }`, errors: [error] },
    { code: `@Injectable() abstract class A { constructor(a: A) {} }`, errors: [error] },
    /* Class extending another one */
    { code: `@Component() class A extends B { constructor(a: A) { super(a); } }`, errors: [error] },
    /* Angular class nested in an undecorated context */
    { code: `function f() { @Injectable() class A { constructor(a: A) {} } }`, errors: [error] },
    /* Constructor overload signatures are MethodDefinitions too */
    {
      code: `@Injectable() class A { constructor(a: A); constructor(a?: A) {} }`,
      errors: [error, error],
    },
    /* Several Angular classes in a file */
    {
      code: `
        @Component() class A { constructor(a: A) {} }
        @Injectable() class B { constructor(b: B) {} }
      `,
      errors: [error, error],
    },
  ],
});
