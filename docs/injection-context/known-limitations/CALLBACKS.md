# Synchronous callbacks

This known limitation is a false positive.

The injection context is lost only in _asynchronous_ callbacks. Technically, it should still be available in _synchronous_ callbacks. But it is not possible to differenciate asynchronous and synchronous callbacks during the lint analysis. So the rules will report in _any_ callback.

While this is a limitation, it is acceptable as it is better to always do context injection sensitive declarations upstream, before any callback, for several reasons:
- to avoid errors, as some functions can be synchronous or asynchronous depending on complex contexts, hard to understand for beginners, and not apparent at first glance even for experts (notably all RxJS functions)
- to be consistent

These are lint rules like any other, so they can be disabled when necessary, for example:
```typescript
// eslint-disable-next-line eslint-plugin-angular-modern/inject-in-injection-context
inject(MyService);
```

[Back to README](../../../README.md)
