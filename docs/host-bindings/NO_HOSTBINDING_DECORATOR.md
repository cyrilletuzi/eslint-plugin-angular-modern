# no-hostbinding-decorator

Restrict the usage of legacy `HostBinding`.

Use `host` property instead, which is typed checked.

## Documentation

- [Host elements guide](https://angular.dev/guide/components/host-elements)

## Configuration

- in the `recommended` preset
- in the `hostBindings` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-hostbinding-decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({})
export class SomeComponent {
  @HostBinding('role') role = 'slider';
}
```

## ✅ Valid

```typescript
@Component({
  host: {
    role: 'slider',
  },
})
export class SomeComponent {}
```

[Back to README](../../README.md)
