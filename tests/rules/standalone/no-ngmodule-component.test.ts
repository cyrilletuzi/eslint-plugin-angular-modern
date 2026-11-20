import * as rule from "../../../src/rules/standalone/no-ngmodule-component.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmoduleComponent" };

testRule(rule, {
  valid: [
    // Doc example: no standalone property (standalone by default)
    `@Component({})
export class SomeClass {}`,
    `@Component({
  selector: "app-root",
  template: "",
})
export class SomeClass {}`,
    // standalone: true
    `@Component({
  selector: "app-root",
  template: "",
  standalone: true,
})
export class SomeClass {}`,
    // getDecoratorProperty: decorator without call / without argument / non-object argument
    `@Component
export class SomeClass {}`,
    `@Component()
export class SomeClass {}`,
    `const config = { standalone: false };

@Component(config)
export class SomeClass {}`,
    // Only the first argument is read
    `@Component({}, { standalone: false })
export class SomeClass {}`,
    // Spread elements are skipped (not resolved)
    `const base = { standalone: false };

@Component({ ...base })
export class SomeClass {}`,
    // Value is not the literal `false`
    `@Component({ standalone: "false" })
export class SomeClass {}`,
    `@Component({ standalone: 0 })
export class SomeClass {}`,
    `@Component({ standalone: null })
export class SomeClass {}`,
    `const isStandalone = false;

@Component({ standalone: isStandalone })
export class SomeClass {}`,
    `const standalone = false;

@Component({ standalone })
export class SomeClass {}`,
    `@Component({ standalone() { return false; } })
export class SomeClass {}`,
    // SUSPECTED BUG: `!true` is a UnaryExpression, not a Literal (false negative)
    `@Component({ standalone: !true })
export class SomeClass {}`,
    // Key is not an Identifier named standalone
    // SUSPECTED BUG: quoted key is a Literal, not an Identifier (false negative)
    `@Component({ "standalone": false })
export class SomeClass {}`,
    `@Component({ ["standalone"]: false })
export class SomeClass {}`,
    `@Component({ isStandalone: false })
export class SomeClass {}`,
    `@Component({ Standalone: false })
export class SomeClass {}`,
    // Only the first matching property is checked
    `@Component({ standalone: true, standalone: false })
export class SomeClass {}`,
    // Other decorators are not checked (exact callee name)
    `@Directive({ standalone: false })
export class SomeClass {}`,
    `@Pipe({ standalone: false })
export class SomeClass {}`,
    `@NgModule({ standalone: false })
export class SomeClass {}`,
    `@Injectable({ standalone: false })
export class SomeClass {}`,
    `@Components({ standalone: false })
export class SomeClass {}`,
    `@MyComponent({ standalone: false })
export class SomeClass {}`,
    `@component({ standalone: false })
export class SomeClass {}`,
    // Not a decorator
    `const config = { standalone: false };`,
    `Component({ standalone: false });`,
    // SUSPECTED BUG: namespace-qualified decorator (callee is a MemberExpression) is not reported (false negative)
    `import * as ng from "@angular/core";

@ng.Component({ standalone: false })
export class SomeClass {}`,
    // SUSPECTED BUG: aliases are not followed (false negative)
    `import { Component as NgComponent } from "@angular/core";

@NgComponent({ standalone: false })
export class SomeClass {}`,
  ],
  invalid: [
    // Doc example
    {
      code: `@Component({
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
      code: `@Component({ ...base, standalone: false })
export class SomeClass {}`,
      errors: [error],
    },
    // Error is reported on the property itself
    {
      code: `@Component({ standalone: false })\nexport class SomeClass {}`,
      errors: [{ messageId: "noNgmoduleComponent", line: 1, column: 14, endColumn: 31 }],
    },
    // One error per decorator
    {
      code: `@Component({ standalone: false })
export class A {}

@Component({ standalone: false })
export class B {}`,
      errors: [error, error],
    },
    // Any decorator position (selector only checks the decorator, not the target)
    {
      code: `export class A {
  @Component({ standalone: false })
  method() {}
}`,
      errors: [error],
    },
    // SUSPECTED BUG: a computed key referencing a variable named `standalone` matches (key.type is Identifier, `computed` is not checked)
    {
      code: `const standalone = "other";

@Component({ [standalone]: false })
export class SomeClass {}`,
      errors: [error],
    },
  ],
});
