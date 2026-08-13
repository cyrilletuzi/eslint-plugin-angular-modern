# no-routertestingmodule

Restrict the usage of deprecated `RouterTestingModule`.

Use `provideRouter()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Routing guide](https://angular.dev/guide/routing)
- [`provideRouter` API reference](https://angular.dev/api/router/provideRouter)

## Configuration

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-routertestingmodule": "error"
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

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

[Back to README](../../README.md)
