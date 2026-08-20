# no-httpinterceptor-class

Restrict the usage of `HttpInterceptor` which was the way to declare a legacy class-based interceptor.

Use `HttpInterceptorFn` with a functional interceptor instead.

## Documentation

- [HTTP interceptors guide](https://angular.dev/guide/http/interceptors)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-httpinterceptor-class': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req);
  }
}
```

## ✅ Valid

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
```

[Back to README](../../README.md)
