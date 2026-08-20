# no-httpxhrbackend

Restrict the usage of `HttpXhrBackend`, which enables back legacy XHR based HTTP.

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
    'eslint-plugin-angular-modern/no-httpxhrbackend': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: HttpBackend, useClass: HttpXhrBackend },
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
