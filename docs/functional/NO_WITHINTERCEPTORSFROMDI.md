# no-withinterceptorsfromdi

Restrict the usage of `withInterceptorsFromDi`, which was the way to provide legacy class-based interceptors.

Use `withInterceptors()` with functional interceptors instead.

## Documentation

- [HTTP interceptors guide](https://angular.dev/guide/http/interceptors)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-withinterceptorsfromdi": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
  ],
};
```

[Back to README](../../README.md)
