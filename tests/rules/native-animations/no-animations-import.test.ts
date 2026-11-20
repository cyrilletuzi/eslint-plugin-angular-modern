import * as rule from "../../../src/rules/native-animations/no-animations-import.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noAnimationsImport" } as const;

testRule(rule, {
  valid: [
    /* Other Angular packages */
    `import { Component } from '@angular/core';`,
    `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`,
    /* Look-alike paths (regex requires `/` or end after `animations`) */
    `import { a } from '@angular/animationsx';`,
    `import { a } from '@angular/animations-extra';`,
    `import { a } from '@my/angular/animations';`,
    `import { a } from 'angular/animations';`,
    `import { a } from '@Angular/animations';`,
    `import { a } from './@angular/animations';`,
    /* String usage not in an import declaration */
    `const a = '@angular/animations';`,
    // SUSPECTED BUG: re-exports are not ImportDeclaration and are not reported
    `export { trigger } from '@angular/animations';`,
    `export * from '@angular/animations';`,
    // SUSPECTED BUG: dynamic imports are not ImportDeclaration and are not reported
    `const m = await import('@angular/animations');`,
  ],
  invalid: [
    /* Main entry point */
    { code: `import { trigger, transition, style, animate } from '@angular/animations';`, errors: [error] },
    { code: `import { trigger } from "@angular/animations";`, errors: [error] },
    /* Subpaths */
    { code: `import { ɵAnimationEngine } from '@angular/animations/browser';`, errors: [error] },
    { code: `import { MockAnimationDriver } from '@angular/animations/browser/testing';`, errors: [error] },
    /* Trailing slash */
    { code: `import { trigger } from '@angular/animations/';`, errors: [error] },
    /* Import kinds */
    { code: `import type { AnimationEvent } from '@angular/animations';`, errors: [error] },
    { code: `import * as animations from '@angular/animations';`, errors: [error] },
    { code: `import animations from '@angular/animations';`, errors: [error] },
    { code: `import '@angular/animations';`, errors: [error] },
    /* One error per declaration, not per specifier */
    {
      code: `import { trigger } from '@angular/animations'; import { AnimationDriver } from '@angular/animations/browser';`,
      errors: [error, error],
    },
  ],
});
