# no-content-decorator

Restrict the usage of `@ContentChild()` and `@ContentChildren()`.

Use the `contentChild()` and `contentChildren()` signal versions instead.

## Documentation

- [Signal queries migration](https://angular.dev/reference/migrations/signal-queries)
- [`contentChild()` API reference](https://angular.dev/api/core/contentChild)
- [`contentChildren()` API reference](https://angular.dev/api/core/contentChildren)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-content-decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class ProductsPage {
  @ContentChild(Product) product?: Product;
}
```

```typescript
@Component()
export class ProductsPage {
  @ContentChild(Product) product!: Product;
}
```

```typescript
@Component()
export class SomeComponent {
  @ContentChildren(Product) products!: QueryList<Product>;
}
```

## ✅ Valid

```typescript
@Component()
export class ProductsPage {
  readonly product = contentChild(Product);
}
```

```typescript
@Component()
export class ProductsPage {
  readonly product = contentChild.required(Product);
}
```

```typescript
@Component()
export class ProductsPage {
  readonly products = contentChildren(Product);
}
```

[Back to README](../../README.md)
