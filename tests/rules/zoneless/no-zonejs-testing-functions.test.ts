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
    // Method calls on any object are not reported (fakeAsync)
    `obj.fakeAsync();`,
    `this.fakeAsync();`,
    `obj["fakeAsync"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.fakeAsync()` is not reported (unrealistic in Angular code)
    `import * as ng from "@angular/core/testing";

ng.fakeAsync();`,
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
    // Method calls on any object are not reported (discardPeriodicTasks)
    `obj.discardPeriodicTasks();`,
    `this.discardPeriodicTasks();`,
    `obj["discardPeriodicTasks"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.discardPeriodicTasks()` is not reported (unrealistic in Angular code)
    `import * as ng from "@angular/core/testing";

ng.discardPeriodicTasks();`,
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
    // Method calls on any object are not reported (flush)
    `obj.flush();`,
    `this.flush();`,
    `obj["flush"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.flush()` is not reported (unrealistic in Angular code)
    `import * as ng from "@angular/core/testing";

ng.flush();`,
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
    // Method calls on any object are not reported (flushMicrotasks)
    `obj.flushMicrotasks();`,
    `this.flushMicrotasks();`,
    `obj["flushMicrotasks"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.flushMicrotasks()` is not reported (unrealistic in Angular code)
    `import * as ng from "@angular/core/testing";

ng.flushMicrotasks();`,
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
    // Method calls on any object are not reported (resetFakeAsyncZone)
    `obj.resetFakeAsyncZone();`,
    `this.resetFakeAsyncZone();`,
    `obj["resetFakeAsyncZone"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.resetFakeAsyncZone()` is not reported (unrealistic in Angular code)
    `import * as ng from "@angular/core/testing";

ng.resetFakeAsyncZone();`,
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
    // Method calls on any object are not reported (tick)
    `obj.tick();`,
    `this.tick();`,
    `obj["tick"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.tick()` is not reported (unrealistic in Angular code)
    `import * as ng from "@angular/core/testing";

ng.tick();`,
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
    // Method calls on any object are not reported (waitForAsync)
    `obj.waitForAsync();`,
    `this.waitForAsync();`,
    `obj["waitForAsync"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.waitForAsync()` is not reported (unrealistic in Angular code)
    `import * as ng from "@angular/core/testing";

ng.waitForAsync();`,
    // String / comment (waitForAsync)
    `const name = "waitForAsync()";`,
    `// waitForAsync()`,
    // Same name imported from another library is not reported
    `import { flush } from "some-lib";

flush();`,
    // Look-alike names are not reported
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
    // Usage without import is not reported (not an Angular function) (fakeAsync)
    `it("should...", fakeAsync(() => {}));`,
    // Locally declared function with the same name is not reported (fakeAsync)
    `function fakeAsync() {}
fakeAsync();`,
    // Usage without import is not reported (not an Angular function) (discardPeriodicTasks)
    `it("should...", () => {
  discardPeriodicTasks();
});`,
    // Locally declared function with the same name is not reported (discardPeriodicTasks)
    `function discardPeriodicTasks() {}
discardPeriodicTasks();`,
    // Usage without import is not reported (not an Angular function) (flush)
    `it("should...", () => {
  flush();
});`,
    // Locally declared function with the same name is not reported (flush)
    `function flush() {}
flush();`,
    // Usage without import is not reported (not an Angular function) (flushMicrotasks)
    `it("should...", () => {
  flushMicrotasks();
});`,
    // Locally declared function with the same name is not reported (flushMicrotasks)
    `function flushMicrotasks() {}
flushMicrotasks();`,
    // Usage without import is not reported (not an Angular function) (resetFakeAsyncZone)
    `beforeEach(() => {
  resetFakeAsyncZone();
});`,
    // Locally declared function with the same name is not reported (resetFakeAsyncZone)
    `function resetFakeAsyncZone() {}
resetFakeAsyncZone();`,
    // Usage without import is not reported (not an Angular function) (tick)
    `it("should...", () => {
  tick(100);
});`,
    // Locally declared function with the same name is not reported (tick)
    `function tick() {}
tick();`,
    // Usage without import is not reported (not an Angular function) (waitForAsync)
    `beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({});
}));`,
    // Locally declared function with the same name is not reported (waitForAsync)
    `function waitForAsync() {}
waitForAsync();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported (fakeAsync)
    {
      code: `import { fakeAsync } from "@angular/core/testing";

it("should...", fakeAsync(() => {}));`,
      errors: [error],
    },
    // Bare call, with arguments (fakeAsync)
    {
      code: `import { fakeAsync } from "@angular/core/testing";

fakeAsync();`,
      errors: [error],
    },
    {
      code: `import { fakeAsync } from "@angular/core/testing";

fakeAsync(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (fakeAsync)
    {
      code: `import { fakeAsync } from "@angular/core/testing";

fakeAsync?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (fakeAsync)
    {
      code: `import { fakeAsync } from "@angular/core/testing";

async function f() {
  await fakeAsync();
}`,
      errors: [error],
    },
    {
      code: `import { fakeAsync } from "@angular/core/testing";

const f = () => ({ providers: [[fakeAsync()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported (fakeAsync)
    {
      code: `import { fakeAsync } from "@angular/core/testing";

fakeAsync()();`,
      errors: [error],
    },
    // Each call is reported (fakeAsync)
    {
      code: `import { fakeAsync } from "@angular/core/testing";

fakeAsync();
fakeAsync();`,
      errors: [error, error],
    },
    // Realistic usage with import: only the call is reported (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

it("should...", () => {
  discardPeriodicTasks();
});`,
      errors: [error],
    },
    // Bare call, with arguments (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

discardPeriodicTasks();`,
      errors: [error],
    },
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

discardPeriodicTasks(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

discardPeriodicTasks?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

async function f() {
  await discardPeriodicTasks();
}`,
      errors: [error],
    },
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

const f = () => ({ providers: [[discardPeriodicTasks()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

discardPeriodicTasks()();`,
      errors: [error],
    },
    // Each call is reported (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks } from "@angular/core/testing";

discardPeriodicTasks();
discardPeriodicTasks();`,
      errors: [error, error],
    },
    // Realistic usage with import: only the call is reported (flush)
    {
      code: `import { flush } from "@angular/core/testing";

it("should...", () => {
  flush();
});`,
      errors: [error],
    },
    // Bare call, with arguments (flush)
    {
      code: `import { flush } from "@angular/core/testing";

flush();`,
      errors: [error],
    },
    {
      code: `import { flush } from "@angular/core/testing";

flush(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (flush)
    {
      code: `import { flush } from "@angular/core/testing";

flush?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (flush)
    {
      code: `import { flush } from "@angular/core/testing";

async function f() {
  await flush();
}`,
      errors: [error],
    },
    {
      code: `import { flush } from "@angular/core/testing";

const f = () => ({ providers: [[flush()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported (flush)
    {
      code: `import { flush } from "@angular/core/testing";

flush()();`,
      errors: [error],
    },
    // Each call is reported (flush)
    {
      code: `import { flush } from "@angular/core/testing";

flush();
flush();`,
      errors: [error, error],
    },
    // Realistic usage with import: only the call is reported (flushMicrotasks)
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

it("should...", () => {
  flushMicrotasks();
});`,
      errors: [error],
    },
    // Bare call, with arguments (flushMicrotasks)
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

flushMicrotasks();`,
      errors: [error],
    },
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

flushMicrotasks(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (flushMicrotasks)
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

flushMicrotasks?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (flushMicrotasks)
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

async function f() {
  await flushMicrotasks();
}`,
      errors: [error],
    },
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

const f = () => ({ providers: [[flushMicrotasks()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported (flushMicrotasks)
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

flushMicrotasks()();`,
      errors: [error],
    },
    // Each call is reported (flushMicrotasks)
    {
      code: `import { flushMicrotasks } from "@angular/core/testing";

flushMicrotasks();
flushMicrotasks();`,
      errors: [error, error],
    },
    // Realistic usage with import: only the call is reported (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

beforeEach(() => {
  resetFakeAsyncZone();
});`,
      errors: [error],
    },
    // Bare call, with arguments (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

resetFakeAsyncZone();`,
      errors: [error],
    },
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

resetFakeAsyncZone(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

resetFakeAsyncZone?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

async function f() {
  await resetFakeAsyncZone();
}`,
      errors: [error],
    },
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

const f = () => ({ providers: [[resetFakeAsyncZone()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

resetFakeAsyncZone()();`,
      errors: [error],
    },
    // Each call is reported (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone } from "@angular/core/testing";

resetFakeAsyncZone();
resetFakeAsyncZone();`,
      errors: [error, error],
    },
    // Realistic usage with import: only the call is reported (tick)
    {
      code: `import { tick } from "@angular/core/testing";

it("should...", () => {
  tick(100);
});`,
      errors: [error],
    },
    // Bare call, with arguments (tick)
    {
      code: `import { tick } from "@angular/core/testing";

tick();`,
      errors: [error],
    },
    {
      code: `import { tick } from "@angular/core/testing";

tick(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (tick)
    {
      code: `import { tick } from "@angular/core/testing";

tick?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (tick)
    {
      code: `import { tick } from "@angular/core/testing";

async function f() {
  await tick();
}`,
      errors: [error],
    },
    {
      code: `import { tick } from "@angular/core/testing";

const f = () => ({ providers: [[tick()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported (tick)
    {
      code: `import { tick } from "@angular/core/testing";

tick()();`,
      errors: [error],
    },
    // Each call is reported (tick)
    {
      code: `import { tick } from "@angular/core/testing";

tick();
tick();`,
      errors: [error, error],
    },
    // Realistic usage with import: only the call is reported (waitForAsync)
    {
      code: `import { waitForAsync } from "@angular/core/testing";

beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({});
}));`,
      errors: [error],
    },
    // Bare call, with arguments (waitForAsync)
    {
      code: `import { waitForAsync } from "@angular/core/testing";

waitForAsync();`,
      errors: [error],
    },
    {
      code: `import { waitForAsync } from "@angular/core/testing";

waitForAsync(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression (waitForAsync)
    {
      code: `import { waitForAsync } from "@angular/core/testing";

waitForAsync?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function (waitForAsync)
    {
      code: `import { waitForAsync } from "@angular/core/testing";

async function f() {
  await waitForAsync();
}`,
      errors: [error],
    },
    {
      code: `import { waitForAsync } from "@angular/core/testing";

const f = () => ({ providers: [[waitForAsync()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported (waitForAsync)
    {
      code: `import { waitForAsync } from "@angular/core/testing";

waitForAsync()();`,
      errors: [error],
    },
    // Each call is reported (waitForAsync)
    {
      code: `import { waitForAsync } from "@angular/core/testing";

waitForAsync();
waitForAsync();`,
      errors: [error, error],
    },
    // Doc examples: nested calls inside fakeAsync() are each reported
    {
      code: `import { fakeAsync, discardPeriodicTasks } from "@angular/core/testing";

it("should...", fakeAsync(() => {
  discardPeriodicTasks();
}));`,
      errors: [error, error],
    },
    {
      code: `import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";

it("should...", fakeAsync(() => {
  tick();
  flushMicrotasks();
  flush();
}));`,
      errors: [error, error, error, error],
    },
    {
      code: `import { fakeAsync, waitForAsync } from "@angular/core/testing";

it("should...", fakeAsync(() => {
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
    // Aliased import is reported (fakeAsync)
    {
      code: `import { fakeAsync as alias } from "@angular/core/testing";

it("should...", alias(() => {}));`,
      errors: [error],
    },
    // Aliased import is reported (discardPeriodicTasks)
    {
      code: `import { discardPeriodicTasks as alias } from "@angular/core/testing";

it("should...", () => {
  alias();
});`,
      errors: [error],
    },
    // Aliased import is reported (flush)
    {
      code: `import { flush as alias } from "@angular/core/testing";

it("should...", () => {
  alias();
});`,
      errors: [error],
    },
    // Aliased import is reported (flushMicrotasks)
    {
      code: `import { flushMicrotasks as alias } from "@angular/core/testing";

it("should...", () => {
  alias();
});`,
      errors: [error],
    },
    // Aliased import is reported (resetFakeAsyncZone)
    {
      code: `import { resetFakeAsyncZone as alias } from "@angular/core/testing";

beforeEach(() => {
  alias();
});`,
      errors: [error],
    },
    // Aliased import is reported (tick)
    {
      code: `import { tick as alias } from "@angular/core/testing";

it("should...", () => {
  alias(100);
});`,
      errors: [error],
    },
    // Aliased import is reported (waitForAsync)
    {
      code: `import { waitForAsync as alias } from "@angular/core/testing";

beforeEach(alias(() => {
  TestBed.configureTestingModule({});
}));`,
      errors: [error],
    },
  ],
});
