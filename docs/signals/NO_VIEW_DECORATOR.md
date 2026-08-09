# no-view-decorator

Restrict the usage of `@ViewChild()` and `@ViewChildren()`.

Use the `viewChild()` and `viewChildren()` signal versions instead.

## Documentation

- [`viewChild()` API reference](https://angular.dev/api/core/viewChild)
- [`viewChildren()` API reference](https://angular.dev/api/core/viewChildren)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-view-decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class ProductsPage {
  @ViewChild(Product) product?: Product;
}
```

```typescript
@Component()
export class ProductsPage {
  @ViewChild(Product) product!: Product;
}
```

```typescript
@Component()
export class SomeComponent {
  @ViewChildren(Product) products!: QueryList<Product>;
}
```

## ✅ Valid

```typescript
@Component()
export class ProductsPage {
  readonly product = viewChild(Product);
}
```

```typescript
@Component()
export class ProductsPage {
  readonly product = viewChild.required(Product);
}
```

```typescript
@Component()
export class ProductsPage {
  readonly products = viewChildren(Product);
}
```

[Back to README](../../README.md)
