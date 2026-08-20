# no-ngoninit

Restrict the usage of `ngOnInit`.

Resources and signals are designed to be reactive, so waiting manually for the `ngOnInit` phase is not needed anymore.

## Documentation

- [Signals guide](https://angular.dev/guide/signals)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngoninit': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  template: `
    @if (product(); as productValue) {
      <app-product-card [product]="productValue" />
    }
  `,
})
export class ProductPage implements OnInit {
  readonly id = input.required<number>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly productApi = inject(ProductApi);

  protected readonly product = signal<Product | undefined>(undefined);

  ngOnInit(): void {
    this.productApi.getProduct(this.id()).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (product) => {
        this.product.set(product);
      },
      error: () => {}
    });
  }
}
```

```typescript
@Component()
export class ProductsList implements OnInit {
  readonly list = input.required<readonly Product[]>();
  protected count = 0;

  ngOnInit(): void {
    this.count = this.list().length;
  }
}
```

## ✅ Valid

```typescript
@Component({
  template: `
    @if (resource.hasValue()) {
      <app-product-card [product]="resource.value()" />
    }
  `,
})
export class ProductPage {
  readonly id = input.required<number>();

  private readonly productApi = inject(ProductApi);

  protected readonly resource: Resource<Product | undefined>;

  constructor() {
    const resourceRef = rxResource({
      params: () => this.id(),
      stream: ({ params }) => this.productApi.getProduct(params),
    });
    this.resource = resourceRef.asReadonly();
  }
}
```

```typescript
@Component()
export class ProductsList {
  readonly list = input.required<readonly Product[]>();
  protected readonly count = computed(() => this.list().length);
}
```

[Back to README](../../README.md)
