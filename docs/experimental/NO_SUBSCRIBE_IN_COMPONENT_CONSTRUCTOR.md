# no-subscribe-in-component-constructor

Restrict the usage of `.subscribe()` in components constructors.

An observable inside a component constructor can generally be managed with `toSignal()` or `rxResource()`.

## Documentation

- [`toSignal()` API reference](https://angular.dev/api/core/rxjs-interop/toSignal)
- [`rxResource()` API reference](https://angular.dev/api/core/rxjs-interop/rxResource)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-subscribe-in-component-constructor': 'error'
  }
}
```

> [!NOTE]
> This rule is still experimental and is not included in the recommended preset yet, as it is still battle-tested to be sure it is applicable to most cases.

## ❌ Invalid

```typescript
@Component({
  template: `
    @if (products(); as productsValue) {
      @for (product of productsValue) {
        <app-product-card [product]="product" />
      }
    }
  `,
})
export class ProductPage {
  protected readonly products = signal<readonly Product[] | undefined>(undefined);

  constructor() {
    const productApi = inject(ProductApi);
    productApi.getProducts().pipe(
      takeUntilDestroyed(),
    ).subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: () => {},
    });
  }
}
```

```typescript
@Component()
export class AdminPage implements OnInit {
  private readonly auth = inject(Auth);
  private readonly isAuthenticated = signal(false);

  constructor() {
    this.auth.isAuthenticatedObservable.pipe(
      takeUntilDestroyed(),
    ).subscribe((isAuthenticated) => {
      this.isAuthenticated.set(isAuthenticated);
    });
  }
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
@Component()
export class AdminPage implements OnInit {
  private readonly auth = inject(Auth);
  private readonly isAuthenticated = toSignal(
    this.auth.isAuthenticatedObservable,
    { initialValue: false },
  );
}
```

[Back to README](../../README.md)
