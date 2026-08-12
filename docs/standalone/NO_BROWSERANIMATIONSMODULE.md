# no-browseranimationsmodule

Restrict the usage of deprecated `BrowserAnimationsModule`.

It is planned for removal; in the meantime, use `provideAnimations()` or `provideAnimationsAsync()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Animations migration](https://angular.dev/guide/animations/migration#with-animations-package)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-browseranimationsmodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    BrowserAnimationsModule,
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
  ],
};
```

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
  ],
};
```

[Back to README](../../README.md)
