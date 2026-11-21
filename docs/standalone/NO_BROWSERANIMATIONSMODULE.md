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

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-browseranimationsmodule': 'error'
  }
}
```

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

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-browseranimationsmodule.test.ts)

[Back to README](../../README.md)
