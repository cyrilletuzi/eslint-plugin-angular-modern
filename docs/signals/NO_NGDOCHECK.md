# no-ngdocheck

Restrict the usage of `ngDoCheck`.

Resources and signals are designed to be reactive, so waiting manually for the `ngDoCheck` phase is not needed anymore.

## Documentation

- [Signals guide](https://angular.dev/guide/signals)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-ngdocheck": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class SomeComponent implements DoCheck {
  ngDoCheck(): void {}
}
```

[Back to README](../../README.md)
