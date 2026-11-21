# no-createngmodule

Restrict the usage of `createNgModule()`.

Use standalone components, directives and pipes instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-createngmodule': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
createNgModule();
```

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-createngmodule.test.ts)

[Back to README](../../README.md)
