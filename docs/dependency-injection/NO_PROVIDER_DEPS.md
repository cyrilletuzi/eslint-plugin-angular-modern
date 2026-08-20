# no-provider-deps

Restrict the usage of legacy `deps` in providers.

Use `inject()` instead.

## Documentation

- [Defining dependency providers guide](https://angular.dev/guide/di/defining-dependency-providers)
- [`inject()` API reference](https://angular.dev/api/core/inject)

## Configuration

- in the `recommended` preset
- in the `dependencyInjection` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-provider-deps': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
{
  provide: SomeService,
  useFactory: (requiredDep: SomeRequiredDep, optionalDep?: SomeOptionalDep) => {
    // Build and return something
  },
  deps: [SomeRequiredDep, [new Optional(), SomeOptionalDep]],
}
```

## ✅ Valid

```typescript
{
  provide: SomeService,
  useFactory: () => {
    const requiredDep = inject(SomeRequiredDep);
    const optionalDep = inject(SomeOptionalDep, { optional: true });
    // Build and return something
  },
}
```

[Back to README](../../README.md)
