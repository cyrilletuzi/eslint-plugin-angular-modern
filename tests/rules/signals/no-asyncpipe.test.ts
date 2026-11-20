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
    // Import identifier (`ImportSpecifier` parent) is ignored to avoid double reports
    `import { AsyncPipe } from "@angular/common";`,
    `import type { AsyncPipe } from "@angular/common";`,
    // Aliased import: the imported name is ignored, and the local alias does not match
    // SUSPECTED BUG: `AsyncPipe` used through an alias is not reported
    `import { AsyncPipe as Async } from "@angular/common"; @Component({ imports: [Async] }) class A {}`,
    // Local alias named `AsyncPipe` is an import identifier too
    `import { Other as AsyncPipe } from "other-lib";`,
    // Look-alike names
    `@Component({ imports: [asyncPipe, Asyncpipe, AsyncPipes, MyAsyncPipe, NgAsyncPipe] }) class A {}`,
    // A string is not an `Identifier`
    `const a = "AsyncPipe";`,
    // A native private member is a `PrivateIdentifier`
    `class A { #AsyncPipe = 1; }`,
    // Only the class identifier is checked, not the pipe usage in templates
    // SUSPECTED BUG: `| async` via `CommonModule` is not reported
    `@Component({ template: \`{{ data | async }}\`, imports: [CommonModule] }) class A {}`,
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
    // Without import
    { code: `@Component({ imports: [AsyncPipe] }) class A {}`, errors: [{ messageId }] },
    // In `NgModule` imports/exports
    { code: `@NgModule({ imports: [AsyncPipe], exports: [AsyncPipe] }) class A {}`, errors: [{ messageId }, { messageId }] },
    // Instantiation, injection, type annotation, `typeof`
    { code: `const a = new AsyncPipe(ref);`, errors: [{ messageId }] },
    { code: `class A { readonly a = inject(AsyncPipe); }`, errors: [{ messageId }] },
    { code: `let a: AsyncPipe;`, errors: [{ messageId }] },
    { code: `type A = typeof AsyncPipe;`, errors: [{ messageId }] },
    // Member expression property (e.g. namespace import)
    { code: `import * as common from "@angular/common"; @Component({ imports: [common.AsyncPipe] }) class A {}`, errors: [{ messageId }] },
    // Any `Identifier` is matched, whatever its position
    // SUSPECTED BUG: object keys and unrelated local declarations named `AsyncPipe` are reported
    { code: `const a = { AsyncPipe: 1 };`, errors: [{ messageId }] },
    { code: `class AsyncPipe {}`, errors: [{ messageId }] },
    // Only `ImportSpecifier` parents are ignored: default and namespace imports are reported
    { code: `import AsyncPipe from "some-lib";`, errors: [{ messageId }] },
    { code: `import * as AsyncPipe from "some-lib";`, errors: [{ messageId }] },
    // Re-export (`ExportSpecifier` parent) is reported
    // SUSPECTED BUG: reported twice, as `local` and `exported` are 2 distinct `Identifier` nodes
    { code: `export { AsyncPipe } from "@angular/common";`, errors: [{ messageId }, { messageId }] },
    // Local alias named `AsyncPipe` is not reported at import, but is reported on usage
    { code: `import { Other as AsyncPipe } from "other-lib"; new AsyncPipe();`, errors: [{ messageId }] },
    // One report per usage
    { code: `import { AsyncPipe } from "@angular/common"; @Component({ imports: [AsyncPipe] }) class A {} @Component({ imports: [AsyncPipe] }) class B {}`, errors: [{ messageId }, { messageId }] },
  ],
});
