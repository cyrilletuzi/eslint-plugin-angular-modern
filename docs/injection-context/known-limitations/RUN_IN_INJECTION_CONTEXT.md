# runInInjectionContext() done before in the call stack

This known limitation is a false positive.

These rules detect if `runInInjectionContext()` or `TestBed.runInInjectionContext()` is called. But it does so only in the current function. If it was done before in another function in the call stack, the injection may still be available, but the lint analysis cannot detect that.

While this is a limitation, it is acceptable because:
- it is a rare and edge case, happening at framework-level or in low-level libraries, but very unlikely in applications
- seems like a bad practice to rely on another function to manage `runInInjectionContext()`

These are lint rules like any other, so they can be disabled when necessary, for example:
```typescript
// eslint-disable-next-line eslint-plugin-angular-modern/inject-in-injection-context
inject(MyService);
```

[Back to README](../../../README.md)
