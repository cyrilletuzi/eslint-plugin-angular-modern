import * as rule from "../../../src/rules/standalone/no-material-modules.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noMaterialModules" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { MatButtonModule } from "@angular/material/button";`,
    `import { Other, MatButtonModule } from "@angular/material/button";`,
    // Type-only imports alone are not reported either
    `import type { MatButtonModule } from "@angular/material/button";`,
    `import { type MatButtonModule } from "@angular/material/button";`,
    // Aliased imports alone are not reported either
    `import { MatButtonModule as Alias } from "@angular/material/button";`,
    `import { Other as MatButtonModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { MatButtonModule } from "@angular/material/button"; const name = "MatButtonModule";`,
    `import { MatButtonModule } from "@angular/material/button"; // MatButtonModule`,
    `import { MatButtonModule } from "@angular/material/button"; const value = ng["MatButtonModule"];`,
    // Usage without import is not reported
    `@Component({
  imports: [MatButtonModule],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/material/button";

const a = ng.MatButtonModule;`,
    `import { MatButtonModule } from "@angular/material/button"; const a = foo.bar.MatButtonModule;`,
    // Not reported: local declaration with the same name
    `class MatButtonModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as MatButtonModule } from "other-lib";

const a = MatButtonModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import MatButtonModule from "@angular/material/button";`,
    `import * as MatButtonModule from "@angular/material/button";`,
    `import { MatButtonModule } from "@angular/material/button"; import MatButtonModule = require("@angular/material/button");`,
    // Not reported: re-exports without import (not a usage)
    `export { MatButtonModule as Alias } from "@angular/material/button";`,
    `export * as MatButtonModule from "@angular/material/button";`,
    // Not reported: re-export without import (not a usage)
    `export { MatButtonModule } from "@angular/material/button";`,
    // Not reported: non-reference identifiers like object keys
    `import { MatButtonModule } from "@angular/material/button"; const a = { MatButtonModule: true };`,
    // Not reported: a user-defined barrel module starting with "Mat", as it is not imported from Angular Material
    `@NgModule({ exports: [MatButtonModule] })
export class MaterialModule {}`,
    // Not reported: unrelated modules like `MathModule` or `MatrixModule`, as they are not imported from Angular Material
    `import { MathModule } from "some-math-lib";

const imports = [MathModule];`,
    `const imports = [MatrixModule];`,
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
    // Each occurrence is reported
    {
      code: `import { MatButtonModule } from "@angular/material/button";

const a = MatButtonModule;
const b = [MatButtonModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { MatButtonModule } from "@angular/material/button"; MatButtonModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { MatButtonModule } from "@angular/material/button"; let a: MatButtonModule;`,
      errors: [error],
    },
    {
      code: `import { MatButtonModule } from "@angular/material/button"; type T = typeof MatButtonModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { MatButtonModule } from "@angular/material/button";

function f() {
  return () => ({ imports: [[MatButtonModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { MatButtonModule } from "@angular/material/button";

export { MatButtonModule };`,
      errors: [error],
    },
    {
      code: `import { MatButtonModule } from "@angular/material/button"; const a = { MatButtonModule };`,
      errors: [error],
    },
    {
      code: `import { MatButtonModule } from "@angular/material/button"; const { MatButtonModule } = a;`,
      errors: [error],
    },
    // Name variant: MatCardModule
    {
      code: `import { MatCardModule } from "@angular/material/card";

const imports = [MatCardModule];`,
      errors: [error],
    },
    // Name variant: MatDialogModule
    {
      code: `import { MatDialogModule } from "@angular/material/dialog";

const imports = [MatDialogModule];`,
      errors: [error],
    },
    // Name variant: MatNativeDateModule
    {
      code: `import { MatNativeDateModule } from "@angular/material/core";

const imports = [MatNativeDateModule];`,
      errors: [error],
    },
    // Date adapter packages (`@angular/material-*-adapter`)
    {
      code: `import { MatMomentDateModule } from "@angular/material-moment-adapter";

const imports = [MatMomentDateModule];`,
      errors: [error],
    },
    // Modules without the `Mat` prefix
    {
      code: `import { NativeDateModule } from "@angular/material/core";

const imports = [NativeDateModule];`,
      errors: [error],
    },
    // Import from the package root (shorthand)
    {
      code: `import { MatCardModule } from "@angular/material";

const imports = [MatCardModule];`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { MatButtonModule as Alias } from "@angular/material/button";

@Component({
  imports: [Alias],
  template: "<button matButton>Button</button>",
})
export class SomeComponent {}`, errors: [error] },
  ],
});
