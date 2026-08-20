# no-httpclientxsrfmodule

Restrict the usage of `HttpClientXsrfModule`.

Use `withXsrfConfiguration()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [HTTP guide](https://angular.dev/guide/http)
- [`provideHttpClient` API reference](https://angular.dev/api/common/http/provideHttpClient)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-httpclientxsrfmodule': 'error'
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    HttpClientXsrfModule,
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withXsrfConfiguration()),
  ],
};
```

[Back to README](../../README.md)
