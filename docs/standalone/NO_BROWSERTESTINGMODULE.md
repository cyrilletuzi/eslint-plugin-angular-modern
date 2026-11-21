# no-browsertestingmodule

Restrict the usage of `BrowserTestingModule` and `BrowserDynamicTestingModule`.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-browsertestingmodule': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
BrowserTestingModule
BrowserDynamicTestingModule
```

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-browsertestingmodule.test.ts)

[Back to README](../../README.md)
