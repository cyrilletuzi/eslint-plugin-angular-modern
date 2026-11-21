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

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-httpclienttestingmodule': 'error'
  }
}
```

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

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-httpclienttestingmodule.test.ts)

[Back to README](../../README.md)
