# no-noopanimationsmodule

Restrict the usage of deprecated `NoopAnimationsModule`.

It is planned for removal; in the meantime, use `provideAnimations()` or `provideAnimationsAsync()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Animations migration](https://angular.dev/guide/animations/migration#with-animations-package)

## Configuration

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-noopanimationsmodule": "error"
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `standalone` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    NoopAnimationsModule,
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideNoopAnimations(),
  ],
};
```

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync('noop'),
  ],
};
```

[Back to README](../../README.md)
