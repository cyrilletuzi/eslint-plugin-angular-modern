# no-withjsonpsupport

Restrict the usage of deprecated `withJsonpSupport()`.

JSONP is deprecated because of security issues. Use regular HTTP requests with CORS instead.

> [!IMPORTANT]
> When removing `withJsonpSupport()`, also replace all `HttpClient` `.jsonp()` calls with regular requests (for example `.get()`). Without `withJsonpSupport()`, `.jsonp()` calls fail at runtime.

## Documentation

- [HTTP guide](https://angular.dev/guide/http)
- [`provideHttpClient` API reference](https://angular.dev/api/common/http/provideHttpClient)

## Configuration

- in the `recommended` preset
- in the `fetchHttp` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-withjsonpsupport': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withJsonpSupport()),
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

[View the test file for all valid and invalid cases](../../tests/rules/fetch-http/no-withjsonpsupport.test.ts)

[Back to README](../../README.md)
