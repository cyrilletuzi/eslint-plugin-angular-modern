# no-httpclientmodule

Restrict the usage of deprecated `HttpClientModule`.

`HttpClient` service can be used directly in Angular >= 21. If you need configuration (like interceptors), use `provideHttpClient()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [HTTP guide](https://angular.dev/guide/http)
- [`provideHttpClient` API reference](https://angular.dev/api/common/http/provideHttpClient)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-httpclientmodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

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
