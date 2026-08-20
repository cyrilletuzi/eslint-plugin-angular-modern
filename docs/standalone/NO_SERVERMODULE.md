# no-servermodule

Restrict the usage of `ServerModule`.

Use `provideServerRendering()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Server side rendering guide](https://angular.dev/guide/ssr)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-servermodule': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    ServerModule,
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
  ],
};
```

[Back to README](../../README.md)
