# no-ngmodule-directive

Restrict the usage of `standalone: false` in a directive.

Use a standalone directive instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-ngmodule-directive": "error"
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because Angular already has the `strictStandalone` compiler option, which should be prefered. See the [documentation](../standalone/STRICT_STANDALONE.md).

## ❌ Invalid

```typescript
@Directive({
  standalone: false,
})
export class SomeDirective {}
```

## ✅ Valid

```typescript
@Directive({})
export class SomeDirective {}
```

[Back to README](../../README.md)
