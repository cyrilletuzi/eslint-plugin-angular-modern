import * as rule from "../../../src/rules/standalone/no-ngmodule-directive.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmoduleDirective" };

testRule(rule, {
  valid: [
    // Doc example: no standalone property (standalone by default)
    `import { Directive } from "@angular/core";

@Directive({})
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Directive({
  selector: "[appSome]",
})
export class SomeClass {}`,
    // standalone: true
    `import { Directive } from "@angular/core";

@Directive({
  selector: "[appSome]",
  standalone: true,
})
export class SomeClass {}`,
    // getDecoratorProperty: decorator without call / without argument / non-object argument
    `import { Directive } from "@angular/core";

@Directive
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Directive()
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

const config = { standalone: false };

@Directive(config)
export class SomeClass {}`,
    // Only the first argument is read
    `import { Directive } from "@angular/core";

@Directive({}, { standalone: false })
export class SomeClass {}`,
    // Spread elements are skipped (not resolved)
    `import { Directive } from "@angular/core";

const base = { standalone: false };

@Directive({ ...base })
export class SomeClass {}`,
    // Value is not the literal `false`
    `import { Directive } from "@angular/core";

@Directive({ standalone: "false" })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Directive({ standalone: 0 })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Directive({ standalone: null })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

const isStandalone = false;

@Directive({ standalone: isStandalone })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

const standalone = false;

@Directive({ standalone })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Directive({ standalone() { return false; } })
export class SomeClass {}`,
    // ACCEPTED FALSE NEGATIVE: `!true` is not detected as `false` (unrealistic code, `false` would be written directly)
    `import { Directive } from "@angular/core";

@Directive({ standalone: !true })
export class SomeClass {}`,
    // Key not named standalone
    `import { Directive } from "@angular/core";

@Directive({ isStandalone: false })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Directive({ Standalone: false })
export class SomeClass {}`,
    // Only the first matching property is checked
    `import { Directive } from "@angular/core";

@Directive({ standalone: true, standalone: false })
export class SomeClass {}`,
    // Other decorators are not checked (exact callee name)
    `import { Directive } from "@angular/core";

@Component({ standalone: false })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Pipe({ standalone: false })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@NgModule({ standalone: false })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Injectable({ standalone: false })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@Directives({ standalone: false })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@MyDirective({ standalone: false })
export class SomeClass {}`,
    `import { Directive } from "@angular/core";

@directive({ standalone: false })
export class SomeClass {}`,
    // Not a decorator
    `import { Directive } from "@angular/core"; const config = { standalone: false };`,
    `import { Directive } from "@angular/core"; Directive({ standalone: false });`,
    // ACCEPTED FALSE NEGATIVE: namespace-qualified decorator (callee is a MemberExpression) is not reported
    `import * as ng from "@angular/core";

@ng.Directive({ standalone: false })
export class SomeClass {}`,
    // Same name imported from another library is not reported
    `import { Directive } from "other-lib"; @Directive({ standalone: false }) class A {}`,
  ],
  invalid: [
    // Doc example
    {
      code: `import { Directive } from "@angular/core";

@Directive({
  standalone: false,
})
export class SomeClass {}`,
      errors: [error],
    },
    // With other properties and import
    {
      code: `import { Directive } from "@angular/core";

@Directive({
  selector: "[appSome]",
  standalone: false,
})
export class SomeClass {}`,
      errors: [error],
    },
    // After a spread element
    {
      code: `import { Directive } from "@angular/core";

@Directive({ ...base, standalone: false })
export class SomeClass {}`,
      errors: [error],
    },
    // Error is reported on the property itself
    {
      code: `import { Directive } from "@angular/core";

@Directive({ standalone: false })\nexport class SomeClass {}`,
      errors: [{ messageId: "noNgmoduleDirective", line: 3, column: 14, endColumn: 31 }],
    },
    // One error per decorator
    {
      code: `import { Directive } from "@angular/core";

@Directive({ standalone: false })
export class A {}

@Directive({ standalone: false })
export class B {}`,
      errors: [error, error],
    },
    // Any decorator position (selector only checks the decorator, not the target)
    {
      code: `import { Directive } from "@angular/core";

export class A {
  @Directive({ standalone: false })
  method() {}
}`,
      errors: [error],
    },
    // Aliased import is reported
    {
      code: `import { Directive as NgDirective } from "@angular/core";

@NgDirective({ standalone: false })
export class SomeClass {}`, errors: [error]
    },
    // Quoted `standalone` key
    {
      code: `import { Directive } from "@angular/core";

@Directive({ "standalone": false })
export class SomeClass {}`, errors: [error]
    },
    // Computed key with a string
    {
      code: `import { Directive } from "@angular/core";

@Directive({ ["standalone"]: false })
export class SomeClass {}`, errors: [error]
    },
    // ACCEPTED FALSE POSITIVE: a computed key with a variable named `standalone` is matched as the `standalone` property (a dynamic key in a static Angular configuration is a bad practice)
    {
      code: `import { Directive } from "@angular/core";

const standalone = "other";

@Directive({ [standalone]: false })
export class SomeClass {}`, errors: [error]
    },
  ],
});
