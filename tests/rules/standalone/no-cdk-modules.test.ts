import * as rule from "../../../src/rules/standalone/no-cdk-modules.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCdkModules" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { CdkMenuModule } from "@angular/cdk/menu";`,
    `import { Other, CdkMenuModule } from "@angular/cdk/menu";`,
    // Type-only imports alone are not reported either
    `import type { CdkMenuModule } from "@angular/cdk/menu";`,
    `import { type CdkMenuModule } from "@angular/cdk/menu";`,
    // Aliased imports alone are not reported either
    `import { CdkMenuModule as Alias } from "@angular/cdk/menu";`,
    `import { Other as CdkMenuModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { CdkMenuModule } from "@angular/cdk/menu"; const name = "CdkMenuModule";`,
    `import { CdkMenuModule } from "@angular/cdk/menu"; // CdkMenuModule`,
    `import { CdkMenuModule } from "@angular/cdk/menu"; const value = ng["CdkMenuModule"];`,
    // Usage without import is not reported
    `@Component({
  imports: [CdkMenuModule],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/cdk/menu";

const a = ng.CdkMenuModule;`,
    `import { CdkMenuModule } from "@angular/cdk/menu"; const a = foo.bar.CdkMenuModule;`,
    // Not reported: local declaration with the same name
    `class CdkMenuModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as CdkMenuModule } from "other-lib";

const a = CdkMenuModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import CdkMenuModule from "@angular/cdk/menu";`,
    `import * as CdkMenuModule from "@angular/cdk/menu";`,
    `import { CdkMenuModule } from "@angular/cdk/menu"; import CdkMenuModule = require("@angular/cdk/menu");`,
    // Not reported: re-exports without import (not a usage)
    `export { CdkMenuModule as Alias } from "@angular/cdk/menu";`,
    `export * as CdkMenuModule from "@angular/cdk/menu";`,
    // Not reported: re-export without import (not a usage)
    `export { CdkMenuModule } from "@angular/cdk/menu";`,
    // Not reported: non-reference identifiers like object keys
    `import { CdkMenuModule } from "@angular/cdk/menu"; const a = { CdkMenuModule: true };`,
    // Not reported: same-named module imported from another library, e.g. PrimeNG `DialogModule`
    `import { DialogModule } from "primeng/dialog";

@Component({
  imports: [DialogModule],
  template: "",
})
export class SomeComponent {}`,
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
    // Each occurrence is reported
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu";

const a = CdkMenuModule;
const b = [CdkMenuModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu"; CdkMenuModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu"; let a: CdkMenuModule;`,
      errors: [error],
    },
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu"; type T = typeof CdkMenuModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu";

function f() {
  return () => ({ imports: [[CdkMenuModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu";

export { CdkMenuModule };`,
      errors: [error],
    },
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu"; const a = { CdkMenuModule };`,
      errors: [error],
    },
    {
      code: `import { CdkMenuModule } from "@angular/cdk/menu"; const { CdkMenuModule } = a;`,
      errors: [error],
    },
    // Name variant: CdkAccordionModule
    {
      code: `import { CdkAccordionModule } from "@angular/cdk/accordion";

const imports = [CdkAccordionModule];`,
      errors: [error],
    },
    // Name variant: CdkListboxModule
    {
      code: `import { CdkListboxModule } from "@angular/cdk/listbox";

const imports = [CdkListboxModule];`,
      errors: [error],
    },
    // Name variant: CdkStepperModule
    {
      code: `import { CdkStepperModule } from "@angular/cdk/stepper";

const imports = [CdkStepperModule];`,
      errors: [error],
    },
    // Name variant: CdkTableModule
    {
      code: `import { CdkTableModule } from "@angular/cdk/table";

const imports = [CdkTableModule];`,
      errors: [error],
    },
    // Name variant: CdkTreeModule
    {
      code: `import { CdkTreeModule } from "@angular/cdk/tree";

const imports = [CdkTreeModule];`,
      errors: [error],
    },
    // Name variant: CdkScrollableModule
    {
      code: `import { CdkScrollableModule } from "@angular/cdk/scrolling";

const imports = [CdkScrollableModule];`,
      errors: [error],
    },
    // Import from the package root (shorthand)
    {
      code: `import { A11yModule } from "@angular/cdk";

const imports = [A11yModule];`,
      errors: [error],
    },
    // Name variant: A11yModule
    {
      code: `import { A11yModule } from "@angular/cdk/a11y";

const imports = [A11yModule];`,
      errors: [error],
    },
    // Name variant: BidiModule
    {
      code: `import { BidiModule } from "@angular/cdk/bidi";

const imports = [BidiModule];`,
      errors: [error],
    },
    // Name variant: ClipboardModule
    {
      code: `import { ClipboardModule } from "@angular/cdk/clipboard";

const imports = [ClipboardModule];`,
      errors: [error],
    },
    // Name variant: DialogModule
    {
      code: `import { DialogModule } from "@angular/cdk/dialog";

const imports = [DialogModule];`,
      errors: [error],
    },
    // Name variant: DragDropModule
    {
      code: `import { DragDropModule } from "@angular/cdk/drag-drop";

const imports = [DragDropModule];`,
      errors: [error],
    },
    // Name variant: LayoutModule
    {
      code: `import { LayoutModule } from "@angular/cdk/layout";

const imports = [LayoutModule];`,
      errors: [error],
    },
    // Name variant: ObserversModule
    {
      code: `import { ObserversModule } from "@angular/cdk/observers";

const imports = [ObserversModule];`,
      errors: [error],
    },
    // Name variant: OverlayModule
    {
      code: `import { OverlayModule } from "@angular/cdk/overlay";

const imports = [OverlayModule];`,
      errors: [error],
    },
    // Name variant: PlatformModule
    {
      code: `import { PlatformModule } from "@angular/cdk/platform";

const imports = [PlatformModule];`,
      errors: [error],
    },
    // Name variant: PortalModule
    {
      code: `import { PortalModule } from "@angular/cdk/portal";

const imports = [PortalModule];`,
      errors: [error],
    },
    // Name variant: ScrollingModule
    {
      code: `import { ScrollingModule } from "@angular/cdk/scrolling";

const imports = [ScrollingModule];`,
      errors: [error],
    },
    // Name variant: TextFieldModule
    {
      code: `import { TextFieldModule } from "@angular/cdk/text-field";

const imports = [TextFieldModule];`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { CdkMenuModule as Alias } from "@angular/cdk/menu";

@Component({
  imports: [Alias],
  template: "<div cdkMenu><button cdkMenuItem>Cut</button></div>",
})
export class SomeComponent {}`, errors: [error] },
    // Experimental package (`@angular/cdk-experimental`)
    {
      code: `import { CdkComboboxModule } from "@angular/cdk-experimental/combobox";

const imports = [CdkComboboxModule];`,
      errors: [error],
    },
  ],
});
