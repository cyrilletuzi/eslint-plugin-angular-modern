# no-withmodule-testing

Restrict the usage of `withModule`.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-withmodule-testing': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
withModule();
```

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-withmodule-testing.test.ts)

[Back to README](../../README.md)
