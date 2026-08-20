# no-httpclientmodule

Restrict the usage of deprecated `HttpClientModule`.

`HttpClient` service can be used directly in Angular >= 21. If you need configuration (like interceptors), use `provideHttpClient()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [HTTP guide](https://angular.dev/guide/http)
- [`provideHttpClient` API reference](https://angular.dev/api/common/http/provideHttpClient)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-httpclientmodule': 'error'
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    HttpClientModule,
  ],
})
export class AppModule {}
```

## ✅ Valid

- in Angular >= 21, if no special configuration, no import at all

- with configuration, or in Angular < 21:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ],
};
```

[Back to README](../../README.md)
