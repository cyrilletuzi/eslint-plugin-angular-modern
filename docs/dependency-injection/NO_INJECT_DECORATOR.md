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

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-inject-decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Service({
  providedIn: 'root',
})
export class SomeService {
  constructor(@Inject(SOME_TOKEN) private readonly someOption: string) {}
}
```

## ✅ Valid

```typescript
@Service({
  providedIn: 'root',
})
export class SomeService {
   private readonly someOption = inject(SOME_TOKEN);
}
```

[Back to README](../../README.md)
