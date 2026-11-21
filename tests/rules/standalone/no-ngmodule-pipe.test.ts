import * as rule from "../../../src/rules/standalone/no-ngmodule-pipe.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmodulePipe" };

testRule(rule, {
  valid: [
    // Doc example: no standalone property (standalone by default)
    `import { Pipe } from "@angular/core";

@Pipe({})
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Pipe({
  name: "some",
})
export class SomeClass {}`,
    // standalone: true
    `import { Pipe } from "@angular/core";

@Pipe({
  name: "some",
  standalone: true,
})
export class SomeClass {}`,
    // getDecoratorProperty: decorator without call / without argument / non-object argument
    `import { Pipe } from "@angular/core";

@Pipe
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Pipe()
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

const config = { standalone: false };

@Pipe(config)
export class SomeClass {}`,
    // Only the first argument is read
    `import { Pipe } from "@angular/core";

@Pipe({}, { standalone: false })
export class SomeClass {}`,
    // Spread elements are skipped (not resolved)
    `import { Pipe } from "@angular/core";

const base = { standalone: false };

@Pipe({ ...base })
export class SomeClass {}`,
    // Value is not the literal `false`
    `import { Pipe } from "@angular/core";

@Pipe({ standalone: "false" })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Pipe({ standalone: 0 })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Pipe({ standalone: null })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

const isStandalone = false;

@Pipe({ standalone: isStandalone })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

const standalone = false;

@Pipe({ standalone })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Pipe({ standalone() { return false; } })
export class SomeClass {}`,
    // ACCEPTED FALSE NEGATIVE: `!true` is not detected as `false` (unrealistic code, `false` would be written directly)
    `import { Pipe } from "@angular/core";

@Pipe({ standalone: !true })
export class SomeClass {}`,
    // Key not named standalone
    `import { Pipe } from "@angular/core";

@Pipe({ isStandalone: false })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Pipe({ Standalone: false })
export class SomeClass {}`,
    // Only the first matching property is checked
    `import { Pipe } from "@angular/core";

@Pipe({ standalone: true, standalone: false })
export class SomeClass {}`,
    // Other decorators are not checked (exact callee name)
    `import { Pipe } from "@angular/core";

@Component({ standalone: false })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Directive({ standalone: false })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@NgModule({ standalone: false })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Injectable({ standalone: false })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@Pipes({ standalone: false })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@MyPipe({ standalone: false })
export class SomeClass {}`,
    `import { Pipe } from "@angular/core";

@pipe({ standalone: false })
export class SomeClass {}`,
    // Not a decorator
    `import { Pipe } from "@angular/core"; const config = { standalone: false };`,
    `import { Pipe } from "@angular/core"; Pipe({ standalone: false });`,
    // ACCEPTED FALSE NEGATIVE: namespace-qualified decorator (callee is a MemberExpression) is not reported
    `import * as ng from "@angular/core";

@ng.Pipe({ standalone: false })
export class SomeClass {}`,
    // Same name imported from another library is not reported
    `import { Pipe } from "other-lib"; @Pipe({ standalone: false }) class A {}`,
    // Computed key with a variable is not the `standalone` property
    `import { Pipe } from "@angular/core";

const standalone = "other";

@Pipe({ [standalone]: false })
export class SomeClass {}`,
  ],
  invalid: [
    // Doc example
    {
      code: `import { Pipe } from "@angular/core";

@Pipe({
  standalone: false,
})
export class SomeClass {}`,
      errors: [error],
    },
    // With other properties and import
    {
      code: `import { Pipe } from "@angular/core";

@Pipe({
  name: "some",
  standalone: false,
})
export class SomeClass {}`,
      errors: [error],
    },
    // After a spread element
    {
      code: `import { Pipe } from "@angular/core";

@Pipe({ ...base, standalone: false })
export class SomeClass {}`,
      errors: [error],
    },
    // Error is reported on the property itself
    {
      code: `import { Pipe } from "@angular/core";

@Pipe({ standalone: false })\nexport class SomeClass {}`,
      errors: [{ messageId: "noNgmodulePipe", line: 3, column: 9, endColumn: 26 }],
    },
    // One error per decorator
    {
      code: `import { Pipe } from "@angular/core";

@Pipe({ standalone: false })
export class A {}

@Pipe({ standalone: false })
export class B {}`,
      errors: [error, error],
    },
    // Any decorator position (selector only checks the decorator, not the target)
    {
      code: `import { Pipe } from "@angular/core";

export class A {
  @Pipe({ standalone: false })
  method() {}
}`,
      errors: [error],
    },
    // Aliased import is reported
    {
      code: `import { Pipe as NgPipe } from "@angular/core";

@NgPipe({ standalone: false })
export class SomeClass {}`, errors: [error]
    },
    // Quoted `standalone` key
    {
      code: `import { Pipe } from "@angular/core";

@Pipe({ "standalone": false })
export class SomeClass {}`, errors: [error]
    },
    // Computed key with a string
    {
      code: `import { Pipe } from "@angular/core";

@Pipe({ ["standalone"]: false })
export class SomeClass {}`, errors: [error]
    },
  ],
});
