import * as rule from "../../../src/rules/standalone/no-ngmodule-pipe.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmodulePipe" };

testRule(rule, {
  valid: [
    // Doc example: no standalone property (standalone by default)
    `@Pipe({})
export class SomeClass {}`,
    `@Pipe({
  name: "some",
})
export class SomeClass {}`,
    // standalone: true
    `@Pipe({
  name: "some",
  standalone: true,
})
export class SomeClass {}`,
    // getDecoratorProperty: decorator without call / without argument / non-object argument
    `@Pipe
export class SomeClass {}`,
    `@Pipe()
export class SomeClass {}`,
    `const config = { standalone: false };

@Pipe(config)
export class SomeClass {}`,
    // Only the first argument is read
    `@Pipe({}, { standalone: false })
export class SomeClass {}`,
    // Spread elements are skipped (not resolved)
    `const base = { standalone: false };

@Pipe({ ...base })
export class SomeClass {}`,
    // Value is not the literal `false`
    `@Pipe({ standalone: "false" })
export class SomeClass {}`,
    `@Pipe({ standalone: 0 })
export class SomeClass {}`,
    `@Pipe({ standalone: null })
export class SomeClass {}`,
    `const isStandalone = false;

@Pipe({ standalone: isStandalone })
export class SomeClass {}`,
    `const standalone = false;

@Pipe({ standalone })
export class SomeClass {}`,
    `@Pipe({ standalone() { return false; } })
export class SomeClass {}`,
    // SUSPECTED BUG: `!true` is a UnaryExpression, not a Literal (false negative)
    `@Pipe({ standalone: !true })
export class SomeClass {}`,
    // Key is not an Identifier named standalone
    // SUSPECTED BUG: quoted key is a Literal, not an Identifier (false negative)
    `@Pipe({ "standalone": false })
export class SomeClass {}`,
    `@Pipe({ ["standalone"]: false })
export class SomeClass {}`,
    `@Pipe({ isStandalone: false })
export class SomeClass {}`,
    `@Pipe({ Standalone: false })
export class SomeClass {}`,
    // Only the first matching property is checked
    `@Pipe({ standalone: true, standalone: false })
export class SomeClass {}`,
    // Other decorators are not checked (exact callee name)
    `@Component({ standalone: false })
export class SomeClass {}`,
    `@Directive({ standalone: false })
export class SomeClass {}`,
    `@NgModule({ standalone: false })
export class SomeClass {}`,
    `@Injectable({ standalone: false })
export class SomeClass {}`,
    `@Pipes({ standalone: false })
export class SomeClass {}`,
    `@MyPipe({ standalone: false })
export class SomeClass {}`,
    `@pipe({ standalone: false })
export class SomeClass {}`,
    // Not a decorator
    `const config = { standalone: false };`,
    `Pipe({ standalone: false });`,
    // SUSPECTED BUG: namespace-qualified decorator (callee is a MemberExpression) is not reported (false negative)
    `import * as ng from "@angular/core";

@ng.Pipe({ standalone: false })
export class SomeClass {}`,
    // SUSPECTED BUG: aliases are not followed (false negative)
    `import { Pipe as NgPipe } from "@angular/core";

@NgPipe({ standalone: false })
export class SomeClass {}`,
  ],
  invalid: [
    // Doc example
    {
      code: `@Pipe({
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
      code: `@Pipe({ ...base, standalone: false })
export class SomeClass {}`,
      errors: [error],
    },
    // Error is reported on the property itself
    {
      code: `@Pipe({ standalone: false })\nexport class SomeClass {}`,
      errors: [{ messageId: "noNgmodulePipe", line: 1, column: 9, endColumn: 26 }],
    },
    // One error per decorator
    {
      code: `@Pipe({ standalone: false })
export class A {}

@Pipe({ standalone: false })
export class B {}`,
      errors: [error, error],
    },
    // Any decorator position (selector only checks the decorator, not the target)
    {
      code: `export class A {
  @Pipe({ standalone: false })
  method() {}
}`,
      errors: [error],
    },
    // SUSPECTED BUG: a computed key referencing a variable named `standalone` matches (key.type is Identifier, `computed` is not checked)
    {
      code: `const standalone = "other";

@Pipe({ [standalone]: false })
export class SomeClass {}`,
      errors: [error],
    },
  ],
});
