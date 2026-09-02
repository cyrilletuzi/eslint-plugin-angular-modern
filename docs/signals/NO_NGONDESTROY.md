# no-ngondestroy

Restrict the usage of `ngOnDestroy`.

Signals and resources destroy is automatic. When really needed, use `DestroyRef.onDestroy()`.

## Documentation

- [Signals guide](https://angular.dev/guide/signals)
- [`DestroyRef()` API reference](https://angular.dev/api/core/DestroyRef)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngondestroy': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class ProductsPage implements OnDestroy {
  readonly #subscription: Subscription;

  constructor() {
    const productApi = inject(ProductApi);
    this.#subscription = this.productApi.getProducts().subscribe();
  }

  ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }
}
```

## ✅ Valid

```typescript
@Component()
export class ProductsPage {
  constructor() {
    const productApi = inject(ProductApi);
    rxResource({
      stream: () => productApi.getProducts(),
    });
  }
}
```

```typescript
@Component()
export class ProductsPage {
  constructor() {
    const productApi = inject(ProductApi);
    this.productApi.getProducts().pipe(
      takeUntilDestroyed(),
    ).subscribe();
  }
}
```

```typescript
@Component()
export class ProductsPage {
  constructor() {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => {
      // Do the very rare thing needing a manual cleanup
    });
  }
}
```

[Back to README](../../README.md)
