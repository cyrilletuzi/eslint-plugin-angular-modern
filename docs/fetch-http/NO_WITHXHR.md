# no-withxhr

Restrict the usage of `withXhr()`, which enables back legacy XHR based HTTP.

Stay on the default fetch based HTTP instead.

## Documentation

- [HTTP guide](https://angular.dev/guide/http)

## Configuration

- in the `recommended` preset
- in the `fetchHttp` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-withxhr': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withXhr()),
  ],
};
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ],
};
```

[Back to README](../../README.md)
