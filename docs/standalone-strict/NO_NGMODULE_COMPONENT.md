# no-ngmodule-component

Restrict the usage of `standalone: false` in a component.

Use a standalone component instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-ngmodule-component": "error"
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because Angular already has the `strictStandalone` compiler option, which should be prefered. See the [documentation](./STRICT_STANDALONE.md).

## ❌ Invalid

```typescript
@Component({
  standalone: false,
})
export class SomeComponent {}
```

## ✅ Valid

```typescript
@Component({})
export class SomeComponent {}
```

[Back to README](../../README.md)
