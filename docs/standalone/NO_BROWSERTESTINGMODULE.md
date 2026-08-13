# no-browsertestingmodule

Restrict the usage of `BrowserTestingModule`.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-browsertestingmodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
BrowserTestingModule
```

[Back to README](../../README.md)
