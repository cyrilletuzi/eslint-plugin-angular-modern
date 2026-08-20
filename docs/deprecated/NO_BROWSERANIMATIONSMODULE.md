# no-browseranimationsmodule

Restrict the usage of deprecated `BrowserAnimationsModule`.

It is planned for removal; in the meantime, use `provideAnimations()` or `provideAnimationsAsync()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Animations migration](https://angular.dev/guide/animations/migration#with-animations-package)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-browseranimationsmodule': 'error'
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

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
