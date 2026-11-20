import * as rule from "../../../src/rules/zoneless/no-zonejs-testing-functions.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noZonejsTestingFunctions" };

testRule(rule, {
  valid: [
    // Import alone is not a call (fakeAsync)
    `import { fakeAsync } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call (fakeAsync)
    `function fakeAsync() {}`,
    // Reference without call (callback, assignment) (fakeAsync)
    `const fn = fakeAsync;`,
    `register(fakeAsync);`,
    // `new` is a NewExpression, not a CallExpression (fakeAsync)
    `new fakeAsync();`,
    // Callee is not an Identifier: method calls on any object (fakeAsync)
    `obj.fakeAsync();`,
    `this.fakeAsync();`,
    `obj["fakeAsync"]();`,
    // SUSPECTED BUG: namespace import usage `ng.fakeAsync()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.fakeAsync();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { fakeAsync as alias } from "@angular/core/testing";

it("should...", alias(() => {}));`,
    // String / comment (fakeAsync)
    `const name = "fakeAsync()";`,
    `// fakeAsync()`,
    // Import alone is not a call (discardPeriodicTasks)
    `import { discardPeriodicTasks } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call (discardPeriodicTasks)
    `function discardPeriodicTasks() {}`,
    // Reference without call (callback, assignment) (discardPeriodicTasks)
    `const fn = discardPeriodicTasks;`,
    `register(discardPeriodicTasks);`,
    // `new` is a NewExpression, not a CallExpression (discardPeriodicTasks)
    `new discardPeriodicTasks();`,
    // Callee is not an Identifier: method calls on any object (discardPeriodicTasks)
    `obj.discardPeriodicTasks();`,
    `this.discardPeriodicTasks();`,
    `obj["discardPeriodicTasks"]();`,
    // SUSPECTED BUG: namespace import usage `ng.discardPeriodicTasks()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.discardPeriodicTasks();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { discardPeriodicTasks as alias } from "@angular/core/testing";

it("should...", () => {
  alias();
});`,
    // String / comment (discardPeriodicTasks)
    `const name = "discardPeriodicTasks()";`,
    `// discardPeriodicTasks()`,
    // Import alone is not a call (flush)
    `import { flush } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call (flush)
    `function flush() {}`,
    // Reference without call (callback, assignment) (flush)
    `const fn = flush;`,
    `register(flush);`,
    // `new` is a NewExpression, not a CallExpression (flush)
    `new flush();`,
    // Callee is not an Identifier: method calls on any object (flush)
    `obj.flush();`,
    `this.flush();`,
    `obj["flush"]();`,
    // SUSPECTED BUG: namespace import usage `ng.flush()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.flush();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { flush as alias } from "@angular/core/testing";

it("should...", () => {
  alias();
});`,
    // String / comment (flush)
    `const name = "flush()";`,
    `// flush()`,
    // Import alone is not a call (flushMicrotasks)
    `import { flushMicrotasks } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call (flushMicrotasks)
    `function flushMicrotasks() {}`,
    // Reference without call (callback, assignment) (flushMicrotasks)
    `const fn = flushMicrotasks;`,
    `register(flushMicrotasks);`,
    // `new` is a NewExpression, not a CallExpression (flushMicrotasks)
    `new flushMicrotasks();`,
    // Callee is not an Identifier: method calls on any object (flushMicrotasks)
    `obj.flushMicrotasks();`,
    `this.flushMicrotasks();`,
    `obj["flushMicrotasks"]();`,
    // SUSPECTED BUG: namespace import usage `ng.flushMicrotasks()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.flushMicrotasks();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { flushMicrotasks as alias } from "@angular/core/testing";

it("should...", () => {
  alias();
});`,
    // String / comment (flushMicrotasks)
    `const name = "flushMicrotasks()";`,
    `// flushMicrotasks()`,
    // Import alone is not a call (resetFakeAsyncZone)
    `import { resetFakeAsyncZone } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call (resetFakeAsyncZone)
    `function resetFakeAsyncZone() {}`,
    // Reference without call (callback, assignment) (resetFakeAsyncZone)
    `const fn = resetFakeAsyncZone;`,
    `register(resetFakeAsyncZone);`,
    // `new` is a NewExpression, not a CallExpression (resetFakeAsyncZone)
    `new resetFakeAsyncZone();`,
    // Callee is not an Identifier: method calls on any object (resetFakeAsyncZone)
    `obj.resetFakeAsyncZone();`,
    `this.resetFakeAsyncZone();`,
    `obj["resetFakeAsyncZone"]();`,
    // SUSPECTED BUG: namespace import usage `ng.resetFakeAsyncZone()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.resetFakeAsyncZone();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { resetFakeAsyncZone as alias } from "@angular/core/testing";

beforeEach(() => {
  alias();
});`,
    // String / comment (resetFakeAsyncZone)
    `const name = "resetFakeAsyncZone()";`,
    `// resetFakeAsyncZone()`,
    // Import alone is not a call (tick)
    `import { tick } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call (tick)
    `function tick() {}`,
    // Reference without call (callback, assignment) (tick)
    `const fn = tick;`,
    `register(tick);`,
    // `new` is a NewExpression, not a CallExpression (tick)
    `new tick();`,
    // Callee is not an Identifier: method calls on any object (tick)
    `obj.tick();`,
    `this.tick();`,
    `obj["tick"]();`,
    // SUSPECTED BUG: namespace import usage `ng.tick()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.tick();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { tick as alias } from "@angular/core/testing";

it("should...", () => {
  alias(100);
});`,
    // String / comment (tick)
    `const name = "tick()";`,
    `// tick()`,
    // Import alone is not a call (waitForAsync)
    `import { waitForAsync } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call (waitForAsync)
    `function waitForAsync() {}`,
    // Reference without call (callback, assignment) (waitForAsync)
    `const fn = waitForAsync;`,
    `register(waitForAsync);`,
    // `new` is a NewExpression, not a CallExpression (waitForAsync)
    `new waitForAsync();`,
    // Callee is not an Identifier: method calls on any object (waitForAsync)
    `obj.waitForAsync();`,
    `this.waitForAsync();`,
    `obj["waitForAsync"]();`,
    // SUSPECTED BUG: namespace import usage `ng.waitForAsync()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.waitForAsync();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { waitForAsync as alias } from "@angular/core/testing";

beforeEach(alias(() => {
  TestBed.configureTestingModule({});
}));`,
    // String / comment (waitForAsync)
    `const name = "waitForAsync()";`,
    `// waitForAsync()`,
    // Look-alike names (exact name match only)
    `fakeAsyncTest();`,
    `flushAll();`,
    `flushPromises();`,
    `ticker();`,
    `waitForAsyncs();`,
    `async();`,
    `waitFor();`,
    `Tick();`,
    // Method calls with the same names are not reported (e.g. jasmine clock, RxJS TestScheduler)
    `jasmine.clock().tick(100);`,
    `testScheduler.flush();`,
    `vi.advanceTimersByTime(100);`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported (fakeAsync)
    {
      code: `import { fakeAsync } from "@angular/core/testing";

it("should...", fakeAsync(() => {}));`,
      errors: [error],
    },
    // Usage without import (name-based) (fakeAsync)
    {
      code: `it("should...", fakeAsync(() => {}));`,
      errors: [error],
    },
    // Bare call, with arguments (fakeAsync)
    {
      code: `fakeAsync();`,
      errors: [error],
    },
    {
      code: `fakeAsync(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (fakeAsync)
    {
      code: `fakeAsync?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (fakeAsync)
    {
      code: `async function f() {
  await fakeAsync();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[fakeAsync()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee (fakeAsync)
    {
      code: `fakeAsync()();`,
      errors: [error],
    },
    // Each call is reported (fakeAsync)
    {
      code: `fakeAsync();
fakeAsync();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check) (fakeAsync)
    {
      code: `function fakeAsync() {}
fakeAsync();`,
      errors: [error],
    },
    // Realistic usage with import: only the call is reported (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

it("should...", () => {
  discardPeriodicTasks();
});`,
      errors: [error],
    },
    // Usage without import (name-based) (discardPeriodicTasks)
    {
      code: `it("should...", () => {
  discardPeriodicTasks();
});`,
      errors: [error],
    },
    // Bare call, with arguments (discardPeriodicTasks)
    {
      code: `discardPeriodicTasks();`,
      errors: [error],
    },
    {
      code: `discardPeriodicTasks(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (discardPeriodicTasks)
    {
      code: `discardPeriodicTasks?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (discardPeriodicTasks)
    {
      code: `async function f() {
  await discardPeriodicTasks();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[discardPeriodicTasks()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee (discardPeriodicTasks)
    {
      code: `discardPeriodicTasks()();`,
      errors: [error],
    },
    // Each call is reported (discardPeriodicTasks)
    {
      code: `discardPeriodicTasks();
discardPeriodicTasks();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check) (discardPeriodicTasks)
    {
      code: `function discardPeriodicTasks() {}
discardPeriodicTasks();`,
      errors: [error],
    },
    // Realistic usage with import: only the call is reported (flush)
    {
      code: `import { flush } from "@angular/core/testing";

it("should...", () => {
  flush();
});`,
      errors: [error],
    },
    // Usage without import (name-based) (flush)
    {
      code: `it("should...", () => {
  flush();
});`,
      errors: [error],
    },
    // Bare call, with arguments (flush)
    {
      code: `flush();`,
      errors: [error],
    },
    {
      code: `flush(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (flush)
    {
      code: `flush?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (flush)
    {
      code: `async function f() {
  await flush();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[flush()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee (flush)
    {
      code: `flush()();`,
      errors: [error],
    },
    // Each call is reported (flush)
    {
      code: `flush();
flush();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check) (flush)
    {
      code: `function flush() {}
flush();`,
      errors: [error],
    },
    // Realistic usage with import: only the call is reported (flushMicrotasks)
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

it("should...", () => {
  flushMicrotasks();
});`,
      errors: [error],
    },
    // Usage without import (name-based) (flushMicrotasks)
    {
      code: `it("should...", () => {
  flushMicrotasks();
});`,
      errors: [error],
    },
    // Bare call, with arguments (flushMicrotasks)
    {
      code: `flushMicrotasks();`,
      errors: [error],
    },
    {
      code: `flushMicrotasks(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (flushMicrotasks)
    {
      code: `flushMicrotasks?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (flushMicrotasks)
    {
      code: `async function f() {
  await flushMicrotasks();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[flushMicrotasks()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee (flushMicrotasks)
    {
      code: `flushMicrotasks()();`,
      errors: [error],
    },
    // Each call is reported (flushMicrotasks)
    {
      code: `flushMicrotasks();
flushMicrotasks();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check) (flushMicrotasks)
    {
      code: `function flushMicrotasks() {}
flushMicrotasks();`,
      errors: [error],
    },
    // Realistic usage with import: only the call is reported (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

beforeEach(() => {
  resetFakeAsyncZone();
});`,
      errors: [error],
    },
    // Usage without import (name-based) (resetFakeAsyncZone)
    {
      code: `beforeEach(() => {
  resetFakeAsyncZone();
});`,
      errors: [error],
    },
    // Bare call, with arguments (resetFakeAsyncZone)
    {
      code: `resetFakeAsyncZone();`,
      errors: [error],
    },
    {
      code: `resetFakeAsyncZone(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (resetFakeAsyncZone)
    {
      code: `resetFakeAsyncZone?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (resetFakeAsyncZone)
    {
      code: `async function f() {
  await resetFakeAsyncZone();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[resetFakeAsyncZone()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee (resetFakeAsyncZone)
    {
      code: `resetFakeAsyncZone()();`,
      errors: [error],
    },
    // Each call is reported (resetFakeAsyncZone)
    {
      code: `resetFakeAsyncZone();
resetFakeAsyncZone();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check) (resetFakeAsyncZone)
    {
      code: `function resetFakeAsyncZone() {}
resetFakeAsyncZone();`,
      errors: [error],
    },
    // Realistic usage with import: only the call is reported (tick)
    {
      code: `import { tick } from "@angular/core/testing";

it("should...", () => {
  tick(100);
});`,
      errors: [error],
    },
    // Usage without import (name-based) (tick)
    {
      code: `it("should...", () => {
  tick(100);
});`,
      errors: [error],
    },
    // Bare call, with arguments (tick)
    {
      code: `tick();`,
      errors: [error],
    },
    {
      code: `tick(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (tick)
    {
      code: `tick?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (tick)
    {
      code: `async function f() {
  await tick();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[tick()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee (tick)
    {
      code: `tick()();`,
      errors: [error],
    },
    // Each call is reported (tick)
    {
      code: `tick();
tick();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check) (tick)
    {
      code: `function tick() {}
tick();`,
      errors: [error],
    },
    // Realistic usage with import: only the call is reported (waitForAsync)
    {
      code: `import { waitForAsync } from "@angular/core/testing";

beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({});
}));`,
      errors: [error],
    },
    // Usage without import (name-based) (waitForAsync)
    {
      code: `beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({});
}));`,
      errors: [error],
    },
    // Bare call, with arguments (waitForAsync)
    {
      code: `waitForAsync();`,
      errors: [error],
    },
    {
      code: `waitForAsync(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (waitForAsync)
    {
      code: `waitForAsync?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (waitForAsync)
    {
      code: `async function f() {
  await waitForAsync();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[waitForAsync()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee (waitForAsync)
    {
      code: `waitForAsync()();`,
      errors: [error],
    },
    // Each call is reported (waitForAsync)
    {
      code: `waitForAsync();
waitForAsync();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check) (waitForAsync)
    {
      code: `function waitForAsync() {}
waitForAsync();`,
      errors: [error],
    },
    // Doc examples: nested calls inside fakeAsync() are each reported
    {
      code: `it("should...", fakeAsync(() => {
  discardPeriodicTasks();
}));`,
      errors: [error, error],
    },
    {
      code: `it("should...", fakeAsync(() => {
  tick();
  flushMicrotasks();
  flush();
}));`,
      errors: [error, error, error, error],
    },
    {
      code: `it("should...", fakeAsync(() => {
  waitForAsync();
}));`,
      errors: [error, error],
    },
    // Imports of all functions are not reported, only the calls
    {
      code: `import { fakeAsync, discardPeriodicTasks, flush, flushMicrotasks, resetFakeAsyncZone, tick, waitForAsync } from "@angular/core/testing";

fakeAsync(() => {});`,
      errors: [error],
    },
  ],
});
