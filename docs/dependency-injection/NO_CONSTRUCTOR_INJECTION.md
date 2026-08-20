# no-constructor-injection

Restrict the usage of legacy dependency injection in constructors of components, directives, pipes and injectables.

Use `inject()` instead.

## Documentation

- [Dependency injection guide](https://angular.dev/guide/di)
- [`inject()` API reference](https://angular.dev/api/core/inject)

## Configuration

- in the `recommended` preset
- in the `dependencyInjection` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-constructor-injection': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class SomeComponent {
  constructor(private readonly someService: SomeService) {}
}
```

## ✅ Valid

```typescript
@Component()
export class SomeComponent {
   private readonly someService = inject(SomeService);
}
```

[Back to README](../../README.md)
