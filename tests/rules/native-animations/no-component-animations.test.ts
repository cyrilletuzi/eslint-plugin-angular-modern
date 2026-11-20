import * as rule from "../../../src/rules/native-animations/no-component-animations.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noComponentAnimations" } as const;

testRule(rule, {
  valid: [
    /* Native animations */
    `import { Component } from "@angular/core"; @Component({ template: '<div animate.enter="fade-in"></div>', styles: '.fade-in { animation: fade-in 300ms; }' }) class A {}`,
    /* Component without config, with empty config, without call */
    `import { Component } from "@angular/core"; @Component() class A {}`,
    `import { Component } from "@angular/core"; @Component({}) class A {}`,
    `import { Component } from "@angular/core"; @Component class A {}`,
    /* Config which is not an object literal */
    `import { Component } from "@angular/core"; const config = { animations: [] }; @Component(config) class A {}`,
    /* Spread config */
    `import { Component } from "@angular/core"; @Component({ ...config }) class A {}`,
    /* `animations` in a nested object */
    `import { Component } from "@angular/core"; @Component({ host: { animations: [] } }) class A {}`,
    /* Other decorators */
    `import { Component } from "@angular/core"; @Directive({ animations: [] }) class A {}`,
    `import { Component } from "@angular/core"; @NgModule({ animations: [] }) class A {}`,
    `import { Component } from "@angular/core"; @Foo({ animations: [] }) class A {}`,
    /* Member expression decorator */
    `import { Component } from "@angular/core"; @ng.Component({ animations: [] }) class A {}`,
    /* Look-alike keys */
    `import { Component } from "@angular/core"; @Component({ animation: [], Animations: [], animationsList: [] }) class A {}`,
    /* `animations` outside a decorator */
    `import { Component } from "@angular/core"; const config = { animations: [trigger('fade', [])] };`,
    /* Look-alike decorator name */
    `import { Component } from "@angular/core"; @Components({ animations: [] }) class A {}`,
    /* Same name imported from another library is not reported */
    `import { Component } from "other-lib"; @Component({ animations: [] }) class A {}`,
  ],
  invalid: [
    /* Classic usage */
    {
      code: `import { Component } from "@angular/core"; @Component({ animations: [trigger('fade', [transition(':enter', [style({ opacity: 0 }), animate('300ms')])])], template: '' }) class A {}`,
      errors: [error],
    },
    /* Empty array is still reported */
    { code: `import { Component } from "@angular/core"; @Component({ animations: [] }) class A {}`, errors: [error] },
    /* Shorthand and variable value */
    { code: `import { Component } from "@angular/core"; @Component({ animations }) class A {}`, errors: [error] },
    { code: `import { Component } from "@angular/core"; @Component({ selector: 'a', animations: ANIMATIONS }) class A {}`, errors: [error] },
    /* Reported node is the property */
    {
      code: `import { Component } from "@angular/core";

@Component({\n  selector: 'a',\n  animations: [],\n})\nclass A {}`,
      errors: [{ ...error, line: 5, column: 3, endLine: 5, endColumn: 17 }],
    },
    /* Component among other decorators, exported */
    { code: `import { Component } from "@angular/core"; @Foo() @Component({ animations: [] }) export class A {}`, errors: [error] },
    /* Several components */
    {
      code: `import { Component } from "@angular/core"; @Component({ animations: [] }) class A {} @Component({}) class B {} @Component({ animations: [] }) class C {}`,
      errors: [error, error],
    },
    // Quoted `animations` key
    { code: `import { Component } from "@angular/core"; @Component({ 'animations': [] }) class A {}`, errors: [error] },
  ],
});
