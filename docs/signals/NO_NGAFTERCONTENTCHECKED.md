# no-ngaftercontentchecked

Restrict the usage of `ngAfterContentChecked`.

Resources and signals are designed to be reactive, so waiting manually for the `ngAfterContentChecked` phase is not needed anymore.

## Documentation

- [Signals guide](https://angular.dev/guide/signals)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngaftercontentchecked': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class ProductsList implements AfterContentChecked {
  readonly list = contentChildren.required<readonly ProductItem[]>();
  protected count = 0;

  ngAfterContentChecked(): void {
    this.count = this.list().length;
  }
}
```

## ✅ Valid

```typescript
@Component()
export class ProductsList {
  readonly list = contentChildren.required<readonly ProductItem[]>();
  protected readonly count = computed(() => this.list().length);
}
```

[Back to README](../../README.md)
