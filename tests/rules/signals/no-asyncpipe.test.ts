import * as rule from "../../../src/rules/signals/no-asyncpipe.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noAsyncpipe";

testRule(rule, {
  valid: [
    // Doc example: `toSignal()` instead
    `
      @Component({
        template: \`@if (isAuthenticated()) {}\`,
      })
      export class AdminPage {
        readonly #auth = inject(Auth);
        readonly isAuthenticated = toSignal(this.#auth.isAuthenticatedObservable, { initialValue: false });
      }
    `,
    // The import itself is not reported, only usages are
    `import { AsyncPipe } from "@angular/common";`,
    `import type { AsyncPipe } from "@angular/common";`,
    // Local alias named `AsyncPipe` is an import identifier too
    `import { Other as AsyncPipe } from "other-lib";`,
    // Look-alike names
    `@Component({ imports: [asyncPipe, Asyncpipe, AsyncPipes, MyAsyncPipe, NgAsyncPipe] }) class A {}`,
    // A string is not a usage
    `import { AsyncPipe } from "@angular/common"; const a = "AsyncPipe";`,
    // A native private member is not a usage
    `import { AsyncPipe } from "@angular/common"; class A { #AsyncPipe = 1; }`,
    // Only the class identifier is checked, not the pipe usage in templates
    // SUSPECTED BUG: `| async` via `CommonModule` is not reported
    `@Component({ template: \`{{ data | async }}\`, imports: [CommonModule] }) class A {}`,
    // Usage without import is not reported
    `@Component({ imports: [AsyncPipe] }) class A {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as common from "@angular/common"; @Component({ imports: [common.AsyncPipe] }) class A {}`,
    // Not reported: object keys and unrelated local declarations with the same name
    `import { AsyncPipe } from "@angular/common"; const a = { AsyncPipe: 1 };`,
    `class AsyncPipe {}`,
    // Not reported: default and namespace imports with the same name
    `import { AsyncPipe } from "@angular/common"; import AsyncPipe from "some-lib";`,
    `import { AsyncPipe } from "@angular/common"; import * as AsyncPipe from "some-lib";`,
    // Not reported: re-export without import (not a usage)
    `export { AsyncPipe } from "@angular/common";`,
    // Not reported: same local name imported from another library
    `import { Other as AsyncPipe } from "other-lib"; new AsyncPipe();`,
  ],
  invalid: [
    // Doc example: in component `imports`, with the import (import itself not reported)
    {
      code: `
        import { AsyncPipe } from "@angular/common";

        @Component({
          template: \`@if (isAuthenticated | async) {}\`,
          imports: [AsyncPipe],
        })
        export class AdminPage {
          readonly #auth = inject(Auth);
          protected readonly isAuthenticated = this.#auth.isAuthenticatedObservable;
        }
      `,
      errors: [{ messageId }],
    },
    // In `NgModule` imports/exports
    { code: `import { AsyncPipe } from "@angular/common"; @NgModule({ imports: [AsyncPipe], exports: [AsyncPipe] }) class A {}`, errors: [{ messageId }, { messageId }] },
    // Instantiation, injection, type annotation, `typeof`
    { code: `import { AsyncPipe } from "@angular/common"; const a = new AsyncPipe(ref);`, errors: [{ messageId }] },
    { code: `import { AsyncPipe } from "@angular/common"; class A { readonly a = inject(AsyncPipe); }`, errors: [{ messageId }] },
    { code: `import { AsyncPipe } from "@angular/common"; let a: AsyncPipe;`, errors: [{ messageId }] },
    { code: `import { AsyncPipe } from "@angular/common"; type A = typeof AsyncPipe;`, errors: [{ messageId }] },
    // One report per usage
    { code: `import { AsyncPipe } from "@angular/common"; @Component({ imports: [AsyncPipe] }) class A {} @Component({ imports: [AsyncPipe] }) class B {}`, errors: [{ messageId }, { messageId }] },
    // Aliased import is reported
    { code: `import { AsyncPipe as Async } from "@angular/common"; @Component({ imports: [Async] }) class A {}`, errors: [{ messageId }] },
  ],
});
