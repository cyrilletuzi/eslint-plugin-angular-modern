# no-httpclientjsonpmodule

Restrict the usage of deprecated `HttpClientJsonpModule`.

It is planned for removal because of security issues; in the meantime, use `withJsonpSupport()` instead.

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
    'eslint-plugin-angular-modern/no-httpclientjsonpmodule': 'error'
  }
}
```

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    HttpClientJsonpModule,
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withJsonpSupport()),
  ],
};
```

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-httpclientjsonpmodule.test.ts)

[Back to README](../../README.md)
