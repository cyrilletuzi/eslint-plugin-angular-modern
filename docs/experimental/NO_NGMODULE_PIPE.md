# no-ngmodule-pipe

Restrict the usage of `standalone: false` in a pipe.

Use a standalone pipe instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-ngmodule-pipe": "error"
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because Angular already has the `strictStandalone` compiler option, which should be prefered. See the [documentation](../standalone/STRICT_STANDALONE.md).

## ❌ Invalid

```typescript
@Pipe({
  standalone: false,
})
export class SomePipe {}
```

## ✅ Valid

```typescript
@Pipe({})
export class SomePipe {}
```

[Back to README](../../README.md)
