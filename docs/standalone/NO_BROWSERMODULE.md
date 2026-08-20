# no-browsermodule

Restrict the usage of `BrowserModule`.

Use `bootstrapApplication()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [`bootstrapApplication` API reference](https://angular.dev/api/platform-browser/bootstrapApplication)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-browsermodule': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@NgModule({
  imports: [BrowserModule],
})
export class AppModule {}

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
