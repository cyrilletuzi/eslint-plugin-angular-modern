# no-hostlistener-decorator

Restrict the usage of legacy `HostListener`.

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
    "eslint-plugin-angular-modern/no-hostlistener-decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({})
export class SomeComponent {
  @HostListener('keydown', ['$event']) updateValue(event: Event): void {}
}
```

## ✅ Valid

```typescript
@Component({
  host: {
    '(keydown)': 'updateValue($event)',
  },
})
export class SomeComponent {
  updateValue(event: Event): void {}
}
```

[Back to README](../../README.md)
