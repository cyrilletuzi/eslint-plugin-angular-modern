import * as rule from "../../../src/rules/standalone/no-material-modules.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noMaterialModules" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { MatButtonModule } from "@angular/material/button";`,
    `import { Other, MatButtonModule } from "@angular/material/button";`,
    // Type-only imports are still ImportSpecifier
    `import type { MatButtonModule } from "@angular/material/button";`,
    `import { type MatButtonModule } from "@angular/material/button";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { MatButtonModule as Alias } from "@angular/material/button";`,
    `import { Other as MatButtonModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { MatButtonModule as Alias } from "@angular/material/button";

@Component({
  imports: [Alias],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    // Look-alike names (exact name match only)
    `@Component({
  imports: [MyMatButtonModule],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [MatButtonModules],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [MatButtonModuleRef],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [matButtonModule],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [MatButton],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [MatModule],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CdkMenuModule],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "MatButtonModule";`,
    `// MatButtonModule`,
    `const value = ng["MatButtonModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { MatButtonModule } from "@angular/material/button";

@Component({
  imports: [MatButtonModule],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@Component({
  imports: [MatButtonModule],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { MatButtonModule } from "@angular/material/button";

const a = MatButtonModule;
const b = [MatButtonModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/material/button";

const a = ng.MatButtonModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.MatButtonModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `MatButtonModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: MatButtonModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof MatButtonModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[MatButtonModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class MatButtonModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is MatButtonModule: the specifier is not reported, but usages are
    {
      code: `import { Other as MatButtonModule } from "other-lib";

const a = MatButtonModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import MatButtonModule from "@angular/material/button";`,
      errors: [error],
    },
    {
      code: `import * as MatButtonModule from "@angular/material/button";`,
      errors: [error],
    },
    {
      code: `import MatButtonModule = require("@angular/material/button");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { MatButtonModule as Alias } from "@angular/material/button";`,
      errors: [error],
    },
    {
      code: `export * as MatButtonModule from "@angular/material/button";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { MatButtonModule } from "@angular/material/button";`,
      errors: [error, error],
    },
    {
      code: `import { MatButtonModule } from "@angular/material/button";

export { MatButtonModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { MatButtonModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { MatButtonModule };`,
      errors: [error, error],
    },
    {
      code: `const { MatButtonModule } = a;`,
      errors: [error, error],
    },
    // Name variant: MatCardModule
    {
      code: `import { MatCardModule } from "@angular/material";

const imports = [MatCardModule];`,
      errors: [error],
    },
    // Name variant: MatDialogModule
    {
      code: `import { MatDialogModule } from "@angular/material";

const imports = [MatDialogModule];`,
      errors: [error],
    },
    // Name variant: MatNativeDateModule
    {
      code: `import { MatNativeDateModule } from "@angular/material";

const imports = [MatNativeDateModule];`,
      errors: [error],
    },
    // Name variant: MatMomentDateModule
    {
      code: `import { MatMomentDateModule } from "@angular/material";

const imports = [MatMomentDateModule];`,
      errors: [error],
    },
    // Name variant: Mat1Module
    {
      code: `import { Mat1Module } from "@angular/material";

const imports = [Mat1Module];`,
      errors: [error],
    },
    // Name variant: MatXModule
    {
      code: `import { MatXModule } from "@angular/material";

const imports = [MatXModule];`,
      errors: [error],
    },
    // A user-defined barrel module starting with "Mat" is matched too
    {
      code: `@NgModule({ exports: [MatButtonModule] })
export class MaterialModule {}`,
      errors: [error, error],
    },
    // SUSPECTED BUG: /^Mat.+Module$/ does not require an uppercase letter after "Mat", so unrelated names like `MathModule` or `MatrixModule` are reported
    {
      code: `import { MathModule } from "some-math-lib";

const imports = [MathModule];`,
      errors: [error],
    },
    // SUSPECTED BUG: same as above
    {
      code: `const imports = [MatrixModule];`,
      errors: [error],
    },
  ],
});
