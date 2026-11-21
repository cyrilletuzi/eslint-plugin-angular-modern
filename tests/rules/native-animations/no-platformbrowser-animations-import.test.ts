import * as rule from "../../../src/rules/native-animations/no-platformbrowser-animations-import.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noPlatformbrowserAnimationsImport" } as const;

testRule(rule, {
  valid: [
    /* Main platform-browser entry point and other subpaths */
    `import { bootstrapApplication } from '@angular/platform-browser';`,
    `import { By } from '@angular/platform-browser/testing';`,
    /* `@angular/animations` is not this rule concern */
    `import { trigger } from '@angular/animations';`,
    /* Look-alike paths (regex requires `/` or end after `animations`) */
    `import { a } from '@angular/platform-browser/animationsx';`,
    `import { a } from '@angular/platform-browser/animations-extra';`,
    `import { a } from '@angular/platform-browser-dynamic/animations';`,
    `import { a } from '@my/angular/platform-browser/animations';`,
    `import { a } from 'angular/platform-browser/animations';`,
    /* String usage not in an import declaration */
    `const a = '@angular/platform-browser/animations';`,
    // ACCEPTED FALSE NEGATIVE: re-exports are not reported (not a usage, and not used in Angular applications)
    `export { provideAnimations } from '@angular/platform-browser/animations';`,
    // ACCEPTED FALSE NEGATIVE: dynamic imports are not reported (not used: lazy loading is done with `@angular/platform-browser/animations/async`, which is reported)
    `const m = await import('@angular/platform-browser/animations');`,
  ],
  invalid: [
    /* Main animations entry point */
    { code: `import { provideAnimations } from '@angular/platform-browser/animations';`, errors: [error] },
    { code: `import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";`, errors: [error] },
    /* Async subpath */
    { code: `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`, errors: [error] },
    /* Trailing slash */
    { code: `import { provideAnimations } from '@angular/platform-browser/animations/';`, errors: [error] },
    /* Import kinds */
    { code: `import type { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';`, errors: [error] },
    { code: `import * as a from '@angular/platform-browser/animations';`, errors: [error] },
    { code: `import '@angular/platform-browser/animations';`, errors: [error] },
    /* One error per declaration */
    {
      code: `import { provideAnimations } from '@angular/platform-browser/animations'; import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`,
      errors: [error, error],
    },
  ],
});
