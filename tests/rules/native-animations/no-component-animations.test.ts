import * as rule from "../../../src/rules/native-animations/no-component-animations.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noComponentAnimations" } as const;

testRule(rule, {
  valid: [
    /* Native animations */
    `@Component({ template: '<div animate.enter="fade-in"></div>', styles: '.fade-in { animation: fade-in 300ms; }' }) class A {}`,
    /* Component without config, with empty config, without call */
    `@Component() class A {}`,
    `@Component({}) class A {}`,
    `@Component class A {}`,
    /* Config which is not an object literal */
    `const config = { animations: [] }; @Component(config) class A {}`,
    /* Spread config */
    `@Component({ ...config }) class A {}`,
    /* `animations` in a nested object */
    `@Component({ host: { animations: [] } }) class A {}`,
    /* Other decorators */
    `@Directive({ animations: [] }) class A {}`,
    `@NgModule({ animations: [] }) class A {}`,
    `@Foo({ animations: [] }) class A {}`,
    /* Member expression decorator */
    `@ng.Component({ animations: [] }) class A {}`,
    /* Look-alike keys */
    `@Component({ animation: [], Animations: [], animationsList: [] }) class A {}`,
    /* `animations` outside a decorator */
    `const config = { animations: [trigger('fade', [])] };`,
    /* Look-alike decorator name */
    `@Components({ animations: [] }) class A {}`,
    // SUSPECTED BUG: string-quoted `'animations'` key is not found by getDecoratorProperty (only Identifier keys)
    `@Component({ 'animations': [] }) class A {}`,
  ],
  invalid: [
    /* Classic usage */
    {
      code: `@Component({ animations: [trigger('fade', [transition(':enter', [style({ opacity: 0 }), animate('300ms')])])], template: '' }) class A {}`,
      errors: [error],
    },
    /* Empty array is still reported */
    { code: `@Component({ animations: [] }) class A {}`, errors: [error] },
    /* Shorthand and variable value */
    { code: `@Component({ animations }) class A {}`, errors: [error] },
    { code: `@Component({ selector: 'a', animations: ANIMATIONS }) class A {}`, errors: [error] },
    /* Reported node is the property */
    {
      code: `@Component({\n  selector: 'a',\n  animations: [],\n})\nclass A {}`,
      errors: [{ ...error, line: 3, column: 3, endLine: 3, endColumn: 17 }],
    },
    /* Component among other decorators, exported */
    { code: `@Foo() @Component({ animations: [] }) export class A {}`, errors: [error] },
    /* Several components */
    {
      code: `@Component({ animations: [] }) class A {} @Component({}) class B {} @Component({ animations: [] }) class C {}`,
      errors: [error, error],
    },
  ],
});
