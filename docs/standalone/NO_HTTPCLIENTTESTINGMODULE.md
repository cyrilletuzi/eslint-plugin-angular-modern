# no-httpclienttestingmodule

Restrict the usage of `HttpClientTestingModule`.

Use `provideHttpClientTesting()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [HTTP guide](https://angular.dev/guide/http)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-httpclienttestingmodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

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
