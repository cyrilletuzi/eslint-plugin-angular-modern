# no-inject-decorator

Restrict the usage of legacy `@Inject()`.

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
    'eslint-plugin-angular-modern/no-inject-decorator': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class SomeComponent {
  constructor(@Inject(SOME_TOKEN) private readonly someOption: string) {}
}
```

## ✅ Valid

```typescript
@Component()
export class SomeComponent {
   private readonly someOption = inject(SOME_TOKEN);
}
```

```typescript
@Component()
export class SomeComponent {
  readonly #someOption = inject(SOME_TOKEN);
}
```

[Back to README](../../README.md)
