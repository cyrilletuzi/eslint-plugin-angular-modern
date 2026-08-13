# no-platformbrowserdynamic

Restrict the usage of deprecated `platformBrowserDynamic()`.

Use `bootstrapApplication()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [`bootstrapApplication` API reference](https://angular.dev/api/platform-browser/bootstrapApplication)

## Configuration

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-platformbrowserdynamic": "error"
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

## ❌ Invalid

```typescript
platformBrowserDynamic().bootstrapModule(AppModule).catch((message) => {
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
