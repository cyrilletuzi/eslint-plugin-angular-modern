# no-httpclientjsonpmodule

Restrict the usage of deprecated `HttpClientJsonpModule`.

It is planned for removal because of security issues; in the meantime, use `withJsonpSupport()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [HTTP guide](https://angular.dev/guide/http)
- [`provideHttpClient` API reference](https://angular.dev/api/common/http/provideHttpClient)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-httpclientjsonpmodule': 'error'
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

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

[Back to README](../../README.md)
