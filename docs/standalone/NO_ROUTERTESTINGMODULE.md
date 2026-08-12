# no-routertestingmodule

Restrict the usage of deprecated `RouterTestingModule`.

Use `provideRouter()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Routing guide](https://angular.dev/guide/routing)
- [`provideRouter` API reference](https://angular.dev/api/router/provideRouter)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-routertestingmodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

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
