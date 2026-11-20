import * as rule from "../../../src/rules/standalone/no-ngmodule-directive.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmoduleDirective" };

testRule(rule, {
  valid: [
    // Doc example: no standalone property (standalone by default)
    `@Directive({})
export class SomeClass {}`,
    `@Directive({
  selector: "[appSome]",
})
export class SomeClass {}`,
    // standalone: true
    `@Directive({
  selector: "[appSome]",
  standalone: true,
})
export class SomeClass {}`,
    // getDecoratorProperty: decorator without call / without argument / non-object argument
    `@Directive
export class SomeClass {}`,
    `@Directive()
export class SomeClass {}`,
    `const config = { standalone: false };

@Directive(config)
export class SomeClass {}`,
    // Only the first argument is read
    `@Directive({}, { standalone: false })
export class SomeClass {}`,
    // Spread elements are skipped (not resolved)
    `const base = { standalone: false };

@Directive({ ...base })
export class SomeClass {}`,
    // Value is not the literal `false`
    `@Directive({ standalone: "false" })
export class SomeClass {}`,
    `@Directive({ standalone: 0 })
export class SomeClass {}`,
    `@Directive({ standalone: null })
export class SomeClass {}`,
    `const isStandalone = false;

@Directive({ standalone: isStandalone })
export class SomeClass {}`,
    `const standalone = false;

@Directive({ standalone })
export class SomeClass {}`,
    `@Directive({ standalone() { return false; } })
export class SomeClass {}`,
    // SUSPECTED BUG: `!true` is a UnaryExpression, not a Literal (false negative)
    `@Directive({ standalone: !true })
export class SomeClass {}`,
    // Key is not an Identifier named standalone
    // SUSPECTED BUG: quoted key is a Literal, not an Identifier (false negative)
    `@Directive({ "standalone": false })
export class SomeClass {}`,
    `@Directive({ ["standalone"]: false })
export class SomeClass {}`,
    `@Directive({ isStandalone: false })
export class SomeClass {}`,
    `@Directive({ Standalone: false })
export class SomeClass {}`,
    // Only the first matching property is checked
    `@Directive({ standalone: true, standalone: false })
export class SomeClass {}`,
    // Other decorators are not checked (exact callee name)
    `@Component({ standalone: false })
export class SomeClass {}`,
    `@Pipe({ standalone: false })
export class SomeClass {}`,
    `@NgModule({ standalone: false })
export class SomeClass {}`,
    `@Injectable({ standalone: false })
export class SomeClass {}`,
    `@Directives({ standalone: false })
export class SomeClass {}`,
    `@MyDirective({ standalone: false })
export class SomeClass {}`,
    `@directive({ standalone: false })
export class SomeClass {}`,
    // Not a decorator
    `const config = { standalone: false };`,
    `Directive({ standalone: false });`,
    // SUSPECTED BUG: namespace-qualified decorator (callee is a MemberExpression) is not reported (false negative)
    `import * as ng from "@angular/core";

@ng.Directive({ standalone: false })
export class SomeClass {}`,
    // SUSPECTED BUG: aliases are not followed (false negative)
    `import { Directive as NgDirective } from "@angular/core";

@NgDirective({ standalone: false })
export class SomeClass {}`,
  ],
  invalid: [
    // Doc example
    {
      code: `@Directive({
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
      code: `@Directive({ ...base, standalone: false })
export class SomeClass {}`,
      errors: [error],
    },
    // Error is reported on the property itself
    {
      code: `@Directive({ standalone: false })\nexport class SomeClass {}`,
      errors: [{ messageId: "noNgmoduleDirective", line: 1, column: 14, endColumn: 31 }],
    },
    // One error per decorator
    {
      code: `@Directive({ standalone: false })
export class A {}

@Directive({ standalone: false })
export class B {}`,
      errors: [error, error],
    },
    // Any decorator position (selector only checks the decorator, not the target)
    {
      code: `export class A {
  @Directive({ standalone: false })
  method() {}
}`,
      errors: [error],
    },
    // SUSPECTED BUG: a computed key referencing a variable named `standalone` matches (key.type is Identifier, `computed` is not checked)
    {
      code: `const standalone = "other";

@Directive({ [standalone]: false })
export class SomeClass {}`,
      errors: [error],
    },
  ],
});
