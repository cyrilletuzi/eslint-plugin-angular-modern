import * as rule from "../../../src/rules/functional/no-httpinterceptor-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpinterceptorClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: HttpInterceptorFn = (req, next) => next(req);`,
    /* Import only */
    `import { HttpInterceptor } from '@angular/common/http';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, HttpHandler {}`,
    /* Look-alike names */
    `class A implements HttpInterceptorFn, MyHttpInterceptor, HttpInterceptors {}`,
    /* `extends` instead of `implements` */
    `class A extends HttpInterceptor {}`,
    `interface A extends HttpInterceptor {}`,
    /* Type usage (not an `implements` clause) */
    `let a: HttpInterceptor;`,
    // SUSPECTED BUG: qualified name is a MemberExpression, without `name`, so it is not matched
    `class A implements router.HttpInterceptor {}`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { HttpInterceptor as Alias } from '@angular/common/http'; class A implements Alias {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `@Injectable({ providedIn: 'root' }) export class A implements HttpInterceptor {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `class A implements HttpInterceptor {}`, errors: [error] },
    /* With type arguments */
    { code: `class A implements HttpInterceptor<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `class A extends B implements OnDestroy, HttpInterceptor {}`, errors: [error] },
    /* Class expression */
    { code: `const A = class implements HttpInterceptor {};`, errors: [error] },
    /* Abstract class */
    { code: `abstract class A implements HttpInterceptor {}`, errors: [error] },
    /* Import and usage: only the `implements` clause is reported */
    { code: `import { HttpInterceptor } from '@angular/common/http'; class A implements HttpInterceptor {}`, errors: [error] },
    /* Several classes */
    { code: `class A implements HttpInterceptor {} class B implements HttpInterceptor {}`, errors: [error, error] },
  ],
});
