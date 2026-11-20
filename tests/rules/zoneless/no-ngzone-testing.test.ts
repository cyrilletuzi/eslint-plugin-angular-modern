import * as rule from "../../../src/rules/zoneless/no-ngzone-testing.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgzoneTesting" };

testRule(rule, {
  valid: [
    // Other fixture properties
    `it("should...", () => {
  const fixture = TestBed.createComponent(SomeComponent);
  fixture.detectChanges();
  fixture.componentInstance;
});`,
    // Look-alike property names (exact name match)
    `fixture.NgZone;`,
    `fixture.ngZoneRef;`,
    `fixture.zone;`,
    `fixture.ngzone;`,
    // Computed member with an Identifier: the property is a variable, not the ngZone property
    `fixture[ngZone];`,
    // SUSPECTED BUG: destructuring is not a MemberExpression (false negative)
    `const { ngZone } = fixture;`,
    // Identifier not in a member expression
    `const ngZone = inject(NgZone);`,
    `ngZone.run(() => {});`,
    // Class property definition is not a MemberExpression
    `class A {
  ngZone = inject(NgZone);
}`,
    // Object key
    `const a = { ngZone: null };`,
    // Strings and comments
    `const name = "fixture.ngZone";`,
    `// fixture.ngZone`,
    // ACCEPTED FALSE NEGATIVE: computed access with a string is not reported (unnecessary computed access, already flagged by `dot-notation`)
    `fixture["ngZone"];`,
  ],
  invalid: [
    // Doc example
    {
      code: `it("should...", () => {
  const fixture = TestBed.createComponent(SomeComponent);
  fixture.ngZone;
});`,
      errors: [error],
    },
    // Chained usage: only the `.ngZone` MemberExpression matches
    {
      code: `fixture.ngZone?.run(() => {});`,
      errors: [error],
    },
    {
      code: `fixture.ngZone.run(() => {});`,
      errors: [error],
    },
    // Optional member access
    {
      code: `fixture?.ngZone;`,
      errors: [error],
    },
    // Deeper object
    {
      code: `this.fixture.ngZone;`,
      errors: [error],
    },
    // Assignment target
    {
      code: `fixture.ngZone = null;`,
      errors: [error],
    },
    // Each access is reported
    {
      code: `const a = fixture.ngZone;
const b = otherFixture.ngZone;`,
      errors: [error, error],
    },
    // SUSPECTED BUG: any object is matched, not only a ComponentFixture (e.g. an injected NgZone in a component, outside tests)
    {
      code: `@Component({ template: "" })
export class SomeComponent {
  private readonly ngZone = inject(NgZone);

  constructor() {
    this.ngZone.runOutsideAngular(() => {});
  }
}`,
      errors: [error],
    },
  ],
});
