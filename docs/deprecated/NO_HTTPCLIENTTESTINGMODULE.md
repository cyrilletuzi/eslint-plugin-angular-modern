# no-httpclienttestingmodule

Restrict the usage of `HttpClientTestingModule`.

Use `provideHttpClientTesting()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [HTTP guide](https://angular.dev/guide/http)

## Configuration

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-httpclienttestingmodule": "error"
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

## ❌ Invalid

```typescript
TestBed.configureTestingModule({
  imports: [
    HttpClientTestingModule,
  ],
});
```

## ✅ Valid

```typescript
TestBed.configureTestingModule({
  providers: [
    provideHttpClientTesting(),
  ],
});
```

[Back to README](../../README.md)
