# no-providezonechangedetection

Restrict the usage of `provideZoneChangeDetection()`.

## Documentation

- [Signals guide](https://angular.dev/guide/signals)

## Configuration

- in the `recommended` preset
- in the `zoneless` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-providezonechangedetection': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
  ],
};
```

[Back to README](../../README.md)
