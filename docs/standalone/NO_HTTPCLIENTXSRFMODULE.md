# no-httpclientxsrfmodule

Restrict the usage of `HttpClientXsrfModule`.

Use `withXsrfConfiguration()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [HTTP guide](https://angular.dev/guide/http)
- [`provideHttpClient` API reference](https://angular.dev/api/common/http/provideHttpClient)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-httpclientxsrfmodule': 'error'
  }
}
```

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

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-httpclientxsrfmodule.test.ts)

[Back to README](../../README.md)
