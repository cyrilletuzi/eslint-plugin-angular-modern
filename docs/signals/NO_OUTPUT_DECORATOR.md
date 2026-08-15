# no-output-decorator

Restrict the usage of `@Output()`.

Use the `output()` version instead

> [!NOTE]
> Technically, this rule is not related to signals and zoneless, but is for consistency with `input()`.

## Documentation

- [Output function migration](https://angular.dev/reference/migrations/outputs)
- [Outputs guide](https://angular.dev/guide/components/outputs)
- [`output()` API reference](https://angular.dev/api/core/output)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-output-decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class SomeComponent {
  @Output() readonly selected = new EventEmitter<boolean>();
}
```

## ✅ Valid

```typescript
@Component()
export class SomeComponent {
  readonly selected = output<boolean>();
}
```

[Back to README](../../README.md)
