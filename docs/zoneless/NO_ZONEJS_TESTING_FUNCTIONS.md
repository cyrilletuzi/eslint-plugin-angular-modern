# no-zonejs-testing-functions

Restrict the usage of zone.js testing functions:
- `fakeAsync()`
- `discardPeriodicTasks()`
- `flush()`
- `flushMicrotasks()`
- `resetFakeAsyncZone()`
- `tick()`
- `waitForAsync()`

These functions are useless and do not work in a zoneless application.

## Configuration

- in the `recommended` preset
- in the `zoneless` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-zonejs-testing-functions": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
it(`should...`, fakeAsync(() => {}));
```

```typescript
it(`should...`, fakeAsync(() => {
  discardPeriodicTasks();
}));
```

```typescript
it(`should...`, fakeAsync(() => {
  flush();
}));
```

```typescript
it(`should...`, fakeAsync(() => {
  flushMicrotasks();
}));
```

```typescript
beforeEach(() => {
  resetFakeAsyncZone();
});
```

```typescript
it(`should...`, fakeAsync(() => {
  tick();
}));
```

```typescript
it(`should...`, fakeAsync(() => {
  waitForAsync();
}));
```

[Back to README](../../README.md)
