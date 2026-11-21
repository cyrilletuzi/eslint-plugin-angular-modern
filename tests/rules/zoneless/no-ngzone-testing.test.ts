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
    // Destructuring: look-alike names and computed keys
    `const { NgZone, ngZoneRef } = fixture;`,
    `const { [ngZone]: zone } = fixture;`,
    // Destructuring: `this` is never a fixture
    `const { ngZone } = this;`,
    // Destructuring: object literal value named ngZone, not a key
    `const { zone: ngZone } = fixture;`,
    // ACCEPTED FALSE NEGATIVE: parameter destructuring is not reported (any object, e.g. factory dependencies)
    `function f({ ngZone }) {}`,
    `const f = ({ ngZone }) => {};`,
    // ACCEPTED FALSE NEGATIVE: nested destructuring is not reported
    `const { a: { ngZone } } = fixture;`,
    // ACCEPTED FALSE NEGATIVE: assignment destructuring is not reported
    `({ ngZone } = fixture);`,
    // Identifier not in a member expression
    `const ngZone = inject(NgZone);`,
    `ngZone.run(() => {});`,
    // Class property definition is not a MemberExpression
    `class A {
  ngZone = inject(NgZone);
}`,
    // Object key
    `const a = { ngZone: null };`,
    // `this.ngZone` is a class member (e.g. an injected NgZone), never a fixture
    `@Component({ template: "" })
export class SomeComponent {
  private readonly ngZone = inject(NgZone);

  constructor() {
    this.ngZone.runOutsideAngular(() => {});
  }
}`,
    `this.ngZone.run(() => {});`,
    `this?.ngZone;`,
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
    // Destructuring
    {
      code: `const { ngZone } = fixture;`,
      errors: [error],
    },
    {
      code: `const { componentInstance, ngZone, nativeElement } = fixture;`,
      errors: [error],
    },
    {
      code: `const { ngZone: zone } = fixture;`,
      errors: [error],
    },
    {
      code: `const { ngZone = null } = fixture;`,
      errors: [error],
    },
    {
      code: `const { ngZone } = this.fixture;`,
      errors: [error],
    },
    {
      code: `let { ngZone } = fixture;`,
      errors: [error],
    },
    // ACCEPTED FALSE POSITIVE: any object other than `this` is matched, not only a ComponentFixture
    {
      code: `someService.ngZone.run(() => {});`,
      errors: [error],
    },
  ],
});
