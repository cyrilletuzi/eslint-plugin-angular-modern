# Synchronous callbacks and nested functions

This known limitation is a false positive.

The injection context is lost only in _asynchronous_ callbacks, and in nested functions run later. Technically, it should still be available in _synchronous_ callbacks, and in nested functions run synchronously. But it is not possible to know when a function is run during the lint analysis. So the rules will report in _any_ callback or nested function.

For example, the injection context is lost here, because the function is run later:
```typescript
@Component({
  template: `<button (click)="goHome()">Home</button>`
})
export class ProductPage {
  readonly goHome = () => {
    inject(Router).navigate(['/']);
  };
}
```

But it is still available here, because the function is run synchronously, yet the rules will report it:
```typescript
@Component()
export class ProductPage {
  constructor() {
    const init = () => inject(ProductApi).init();
    init();
  }
}
```

While this is a limitation, it is acceptable as it is better to always do context injection sensitive declarations upstream, before any callback or nested function, for several reasons:
- to avoid errors, as some functions can be synchronous or asynchronous depending on complex contexts, hard to understand for beginners, and not apparent at first glance even for experts (notably all RxJS functions)
- to be consistent

```typescript
@Component()
export class ProductPage {
  readonly #productApi = inject(ProductApi);

  constructor() {
    const init = () => this.#productApi.init();
    init();
  }
}
```

These are lint rules like any other, so they can be disabled when necessary, for example:
```typescript
// eslint-disable-next-line eslint-plugin-angular-modern/inject-in-injection-context
inject(MyService);
```

[Back to README](../../../README.md)
