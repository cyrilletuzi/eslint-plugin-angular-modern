# no-ngonchanges

Restrict the usage of `ngOnChanges`.

Resources and signals are designed to be reactive, so waiting manually for the `ngOnChanges` phase is not needed anymore.

## Documentation

- [Signals guide](https://angular.dev/guide/signals)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-ngonchanges": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class ProductsList implements OnChanges {
  readonly list = input.required<readonly Product[]>();
  protected count = 0;

  ngOnChanges(): void {
    this.count = this.list().length;
  }
}
```

## ✅ Valid

```typescript
@Component()
export class ProductsList {
  readonly list = input.required<readonly Product[]>();
  protected readonly count = computed(() => this.list().length);
}
```

[Back to README](../../README.md)
