import * as rule from "../../../src/rules/standalone/no-ngmodule-component.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmoduleComponent" };

testRule(rule, {
  valid: [
    // Doc example: no standalone property (standalone by default)
    `import { Component } from "@angular/core";

@Component({})
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: "",
})
export class SomeClass {}`,
    // standalone: true
    `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: "",
  standalone: true,
})
export class SomeClass {}`,
    // getDecoratorProperty: decorator without call / without argument / non-object argument
    `import { Component } from "@angular/core";

@Component
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Component()
export class SomeClass {}`,
    `import { Component } from "@angular/core";

const config = { standalone: false };

@Component(config)
export class SomeClass {}`,
    // Only the first argument is read
    `import { Component } from "@angular/core";

@Component({}, { standalone: false })
export class SomeClass {}`,
    // Spread elements are skipped (not resolved)
    `import { Component } from "@angular/core";

const base = { standalone: false };

@Component({ ...base })
export class SomeClass {}`,
    // Value is not the literal `false`
    `import { Component } from "@angular/core";

@Component({ standalone: "false" })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Component({ standalone: 0 })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Component({ standalone: null })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

const isStandalone = false;

@Component({ standalone: isStandalone })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

const standalone = false;

@Component({ standalone })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Component({ standalone() { return false; } })
export class SomeClass {}`,
    // ACCEPTED FALSE NEGATIVE: `!true` is not detected as `false` (unrealistic code, `false` would be written directly)
    `import { Component } from "@angular/core";

@Component({ standalone: !true })
export class SomeClass {}`,
    // Key not named standalone
    `import { Component } from "@angular/core";

@Component({ isStandalone: false })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Component({ Standalone: false })
export class SomeClass {}`,
    // Only the first matching property is checked
    `import { Component } from "@angular/core";

@Component({ standalone: true, standalone: false })
export class SomeClass {}`,
    // Other decorators are not checked (exact callee name)
    `import { Component } from "@angular/core";

@Directive({ standalone: false })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Pipe({ standalone: false })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@NgModule({ standalone: false })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Injectable({ standalone: false })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@Components({ standalone: false })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@MyComponent({ standalone: false })
export class SomeClass {}`,
    `import { Component } from "@angular/core";

@component({ standalone: false })
export class SomeClass {}`,
    // Not a decorator
    `import { Component } from "@angular/core"; const config = { standalone: false };`,
    `import { Component } from "@angular/core"; Component({ standalone: false });`,
    // ACCEPTED FALSE NEGATIVE: namespace-qualified decorator (callee is a MemberExpression) is not reported
    `import * as ng from "@angular/core";

@ng.Component({ standalone: false })
export class SomeClass {}`,
    // Same name imported from another library is not reported
    `import { Component } from "other-lib"; @Component({ standalone: false }) class A {}`,
    // Computed key with a variable is not the `standalone` property
    `import { Component } from "@angular/core";

const standalone = "other";

@Component({ [standalone]: false })
export class SomeClass {}`,
  ],
  invalid: [
    // Doc example
    {
      code: `import { Component } from "@angular/core";

@Component({
  standalone: false,
})
export class SomeClass {}`,
      errors: [error],
    },
    // With other properties and import
    {
      code: `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: "",
  standalone: false,
})
export class SomeClass {}`,
      errors: [error],
    },
    // After a spread element
    {
      code: `import { Component } from "@angular/core";

@Component({ ...base, standalone: false })
export class SomeClass {}`,
      errors: [error],
    },
    // Error is reported on the property itself
    {
      code: `import { Component } from "@angular/core";

@Component({ standalone: false })\nexport class SomeClass {}`,
      errors: [{ messageId: "noNgmoduleComponent", line: 3, column: 14, endColumn: 31 }],
    },
    // One error per decorator
    {
      code: `import { Component } from "@angular/core";

@Component({ standalone: false })
export class A {}

@Component({ standalone: false })
export class B {}`,
      errors: [error, error],
    },
    // Any decorator position (selector only checks the decorator, not the target)
    {
      code: `import { Component } from "@angular/core";

export class A {
  @Component({ standalone: false })
  method() {}
}`,
      errors: [error],
    },
    // Aliased import is reported
    {
      code: `import { Component as NgComponent } from "@angular/core";

@NgComponent({ standalone: false })
export class SomeClass {}`, errors: [error]
    },
    // Quoted `standalone` key
    {
      code: `import { Component } from "@angular/core";

@Component({ "standalone": false })
export class SomeClass {}`, errors: [error]
    },
    // Computed key with a string
    {
      code: `import { Component } from "@angular/core";

@Component({ ["standalone"]: false })
export class SomeClass {}`, errors: [error]
    },
  ],
});
