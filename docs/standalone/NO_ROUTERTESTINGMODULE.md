# no-routertestingmodule

Restrict the usage of deprecated `RouterTestingModule`.

Use `provideRouter()` instead.

## Documentation

- [RouterTestingModule migration](https://angular.dev/reference/migrations/router-testing-module-migration)
- [Routing guide](https://angular.dev/guide/routing)
- [`provideRouter` API reference](https://angular.dev/api/router/provideRouter)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-routertestingmodule': 'error'
  }
}
```

## ❌ Invalid

```typescript
TestBed.configureTestingModule({
  imports: [
    RouterTestingModule,
  ],
});
```

## ✅ Valid

```typescript
TestBed.configureTestingModule({
  providers: [
    provideRouter([]),
  ],
});
```

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-routertestingmodule.test.ts)

[Back to README](../../README.md)
