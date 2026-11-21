# no-httpinterceptors-token

Restrict the usage of `HTTP_INTERCEPTORS` which was the way to provide legacy class-based interceptors.

Use `provideHttpClient(withInterceptors())` with functional interceptors instead.

## Documentation

- [HTTP interceptors guide](https://angular.dev/guide/http/interceptors)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-httpinterceptors-token': 'error'
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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppModule {}
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

[View the test file for all valid and invalid cases](../../tests/rules/functional/no-httpinterceptors-token.test.ts)

[Back to README](../../README.md)
