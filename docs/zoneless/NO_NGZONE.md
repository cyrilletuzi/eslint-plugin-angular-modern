# no-ngzone

Restrict the usage of `NgZone`.

It is useless and does not work in a zoneless application.

## Configuration

- in the `recommended` preset
- in the `zoneless` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngzone': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class SomeComponent {
  private readonly ngZone = inject(NgZone);
}
```

[Back to README](../../README.md)
