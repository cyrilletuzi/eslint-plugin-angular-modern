# no-attribute-decorator

Restrict the usage of `@Attribute()`.

Use the `ìnput()` signal version instead.

## Documentation

- [Inputs guide](https://angular.dev/guide/components/inputs)
- [`input()` API reference](https://angular.dev/api/core/input)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-attribute-decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class SomeComponent {
  constructor(@Attribute('option') option: string | null) {}
}
```

## ✅ Valid

```typescript
@Component()
export class SomeComponent {
  readonly option = input<string | undefined>(undefined);
}
```

[Back to README](../../README.md)
