import * as rule from "../../../src/rules/standalone/no-cdk-modules.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCdkModules" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { CdkMenuModule } from "@angular/cdk/menu";`,
    `import { Other, CdkMenuModule } from "@angular/cdk/menu";`,
    // Type-only imports are still ImportSpecifier
    `import type { CdkMenuModule } from "@angular/cdk/menu";`,
    `import { type CdkMenuModule } from "@angular/cdk/menu";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { CdkMenuModule as Alias } from "@angular/cdk/menu";`,
    `import { Other as CdkMenuModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { CdkMenuModule as Alias } from "@angular/cdk/menu";

@Component({
  imports: [Alias],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    // Look-alike names (exact name match only)
    `@Component({
  imports: [MyCdkMenuModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CdkMenuModules],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CdkMenuModuleRef],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [cdkMenuModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CdkMenu],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CdkMenuItem],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CdkModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [MatDialogModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [MyDialogModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [ScrollModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [OverlayModules],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [A11y],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [Dialog],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    `@Component({
  imports: [DialogModuleRef],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "CdkMenuModule";`,
    `// CdkMenuModule`,
    `const value = ng["CdkMenuModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu";

@Component({
  imports: [CdkMenuModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@Component({
  imports: [CdkMenuModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu";

const a = CdkMenuModule;
const b = [CdkMenuModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/cdk/menu";

const a = ng.CdkMenuModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.CdkMenuModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `CdkMenuModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: CdkMenuModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof CdkMenuModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[CdkMenuModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class CdkMenuModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is CdkMenuModule: the specifier is not reported, but usages are
    {
      code: `import { Other as CdkMenuModule } from "other-lib";

const a = CdkMenuModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import CdkMenuModule from "@angular/cdk/menu";`,
      errors: [error],
    },
    {
      code: `import * as CdkMenuModule from "@angular/cdk/menu";`,
      errors: [error],
    },
    {
      code: `import CdkMenuModule = require("@angular/cdk/menu");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { CdkMenuModule as Alias } from "@angular/cdk/menu";`,
      errors: [error],
    },
    {
      code: `export * as CdkMenuModule from "@angular/cdk/menu";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { CdkMenuModule } from "@angular/cdk/menu";`,
      errors: [error, error],
    },
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu";

export { CdkMenuModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { CdkMenuModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { CdkMenuModule };`,
      errors: [error, error],
    },
    {
      code: `const { CdkMenuModule } = a;`,
      errors: [error, error],
    },
    // Name variant: CdkAccordionModule
    {
      code: `import { CdkAccordionModule } from "@angular/cdk";

const imports = [CdkAccordionModule];`,
      errors: [error],
    },
    // Name variant: CdkListboxModule
    {
      code: `import { CdkListboxModule } from "@angular/cdk";

const imports = [CdkListboxModule];`,
      errors: [error],
    },
    // Name variant: CdkStepperModule
    {
      code: `import { CdkStepperModule } from "@angular/cdk";

const imports = [CdkStepperModule];`,
      errors: [error],
    },
    // Name variant: CdkTableModule
    {
      code: `import { CdkTableModule } from "@angular/cdk";

const imports = [CdkTableModule];`,
      errors: [error],
    },
    // Name variant: CdkTreeModule
    {
      code: `import { CdkTreeModule } from "@angular/cdk";

const imports = [CdkTreeModule];`,
      errors: [error],
    },
    // Name variant: CdkScrollableModule
    {
      code: `import { CdkScrollableModule } from "@angular/cdk";

const imports = [CdkScrollableModule];`,
      errors: [error],
    },
    // Name variant: Cdk2Module
    {
      code: `import { Cdk2Module } from "@angular/cdk";

const imports = [Cdk2Module];`,
      errors: [error],
    },
    // Name variant: A11yModule
    {
      code: `import { A11yModule } from "@angular/cdk";

const imports = [A11yModule];`,
      errors: [error],
    },
    // Name variant: BidiModule
    {
      code: `import { BidiModule } from "@angular/cdk";

const imports = [BidiModule];`,
      errors: [error],
    },
    // Name variant: ClipboardModule
    {
      code: `import { ClipboardModule } from "@angular/cdk";

const imports = [ClipboardModule];`,
      errors: [error],
    },
    // Name variant: DialogModule
    {
      code: `import { DialogModule } from "@angular/cdk";

const imports = [DialogModule];`,
      errors: [error],
    },
    // Name variant: DragDropModule
    {
      code: `import { DragDropModule } from "@angular/cdk";

const imports = [DragDropModule];`,
      errors: [error],
    },
    // Name variant: LayoutModule
    {
      code: `import { LayoutModule } from "@angular/cdk";

const imports = [LayoutModule];`,
      errors: [error],
    },
    // Name variant: ObserversModule
    {
      code: `import { ObserversModule } from "@angular/cdk";

const imports = [ObserversModule];`,
      errors: [error],
    },
    // Name variant: OverlayModule
    {
      code: `import { OverlayModule } from "@angular/cdk";

const imports = [OverlayModule];`,
      errors: [error],
    },
    // Name variant: PlatformModule
    {
      code: `import { PlatformModule } from "@angular/cdk";

const imports = [PlatformModule];`,
      errors: [error],
    },
    // Name variant: PortalModule
    {
      code: `import { PortalModule } from "@angular/cdk";

const imports = [PortalModule];`,
      errors: [error],
    },
    // Name variant: ScrollingModule
    {
      code: `import { ScrollingModule } from "@angular/cdk";

const imports = [ScrollingModule];`,
      errors: [error],
    },
    // Name variant: TextFieldModule
    {
      code: `import { TextFieldModule } from "@angular/cdk";

const imports = [TextFieldModule];`,
      errors: [error],
    },
    // SUSPECTED BUG: generic names in the regex (Dialog, Layout, Platform, Portal, Overlay...) also match same-named modules of other libraries, e.g. PrimeNG `DialogModule` (no import source check)
    {
      code: `import { DialogModule } from "primeng/dialog";

@Component({
  imports: [DialogModule],
  template: "",
})
export class SomeComponent {}`,
      errors: [error],
    },
  ],
});
