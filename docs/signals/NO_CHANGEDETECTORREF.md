# no-changedetectorref

Restrict the usage of `ChangeDetectorRef`.

With signals, acting explicitly on the change detection is generally not necessary anymore.

## Documentation

- [`ChangeDetectorRef` API reference](https://angular.dev/api/core/ChangeDetectorRef)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-changedetectorref": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

> [!NOTE]
> This rule is not in the recommended preset, as there are still valid use cases for `ChangeDetectorRef`. But they are rare and low-level, so most applications should enable this rule, and allow exceptions with:

```typescript
// eslint-disable-next-line eslint-plugin-angular-modern/no-changedetectorref
```

## ❌ Invalid

```typescript
@Component()
export class SomeComponent {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
}
```

[Back to README](../../README.md)
