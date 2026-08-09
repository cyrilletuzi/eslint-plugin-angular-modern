# no-asyncpipe

Restrict the usage of `AsyncPipe`.

Use `toSignal()` or `rxResource()` instead.

## Documentation

- [`toSignal()` API reference](https://angular.dev/api/core/rxjs-interop/toSignal)
- [`rxResource()` API reference](https://angular.dev/api/core/rxjs-interop/rxResource)

## Configuration

- in the `recommended` preset (see the [README](../../README.md) for the configuration)
- or just this rule:
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-asyncpipe": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  template: `
    @if (products | async; as productsValue) {
      @for (product of productsValue) {
        <app-product-card [product]="product" />
      }
    }
  `,
  imports: [AsyncPipe],
})
export class ProductPage {
  protected readonly products: Observable<readonly Products[]>;

  constructor() {
    const productApi = inject(ProductApi);
    this.products = productApi.getProducts();
  }
}
```

```typescript
@Component({
  template: `
    @if (isAuthenticated | async) {}
  `,
  imports: [AsyncPipe],
})
export class AdminPage implements OnInit {
  private readonly auth = inject(Auth);
  protected readonly isAuthenticated = this.auth.isAuthenticatedObservable;
}
```

## ✅ Valid

```typescript
@Component({
  template: `
    @if (resource.hasValue()) {
      @for (product of resource.value()) {
        <app-product-card [product]="product" />
      }
    }
  `,
})
export class ProductsPage {
  protected readonly resource: Resource<readonly Product[] | undefined>;

  constructor() {
    const productApi = inject(ProductApi);
    const resourceRef = rxResource({
      stream: () => productApi.getProduct(params),
    });
    this.resource = resourceRef.asReadonly();
  }
}
```

```typescript
@Component({
  template: `
    @if (isAuthenticated()) {}
  `,
})
export class AdminPage implements OnInit {
  private readonly auth = inject(Auth);
  private readonly isAuthenticated = toSignal(
    this.auth.isAuthenticatedObservable,
    { initialValue: false },
  );
}
```

[Back to README](../../README.md)
