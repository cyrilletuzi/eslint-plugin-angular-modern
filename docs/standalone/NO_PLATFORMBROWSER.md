# no-platformbrowser

Restrict the usage of `platformBrowser()`.

Use `bootstrapApplication()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [`bootstrapApplication` API reference](https://angular.dev/api/platform-browser/bootstrapApplication)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-platformbrowser": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
platformBrowser().bootstrapModule(AppModule).catch((message) => {
  console.error(message);
});
```

## ✅ Valid

```typescript
bootstrapApplication(App, appConfig).catch((message) => {
  console.error(message);
});
```

[Back to README](../../README.md)
