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
    `import { HttpInterceptor } from '@angular/common/http'; class A extends HttpInterceptor {}`,
    `import { HttpInterceptor } from '@angular/common/http'; interface A extends HttpInterceptor {}`,
    /* Type usage (not an `implements` clause) */
    `import { HttpInterceptor } from '@angular/common/http'; let a: HttpInterceptor;`,
    // ACCEPTED FALSE NEGATIVE: with a namespace import, the qualified name (`router.X`) is not reported
    `import { HttpInterceptor } from '@angular/common/http'; class A implements router.HttpInterceptor {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `import { HttpInterceptor } from '@angular/common/http'; @Injectable({ providedIn: 'root' }) export class A implements HttpInterceptor {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `import { HttpInterceptor } from '@angular/common/http'; class A implements HttpInterceptor {}`, errors: [error] },
    /* With type arguments */
    { code: `import { HttpInterceptor } from '@angular/common/http'; class A implements HttpInterceptor<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `import { HttpInterceptor } from '@angular/common/http'; class A extends B implements OnDestroy, HttpInterceptor {}`, errors: [error] },
    /* Class expression */
    { code: `import { HttpInterceptor } from '@angular/common/http'; const A = class implements HttpInterceptor {};`, errors: [error] },
    /* Abstract class */
    { code: `import { HttpInterceptor } from '@angular/common/http'; abstract class A implements HttpInterceptor {}`, errors: [error] },
    /* Several classes */
    { code: `import { HttpInterceptor } from '@angular/common/http'; class A implements HttpInterceptor {} class B implements HttpInterceptor {}`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { HttpInterceptor as Alias } from '@angular/common/http'; class A implements Alias {}`, errors: [error] },
  ],
});
