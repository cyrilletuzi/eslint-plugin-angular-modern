# no-noopanimationsmodule

Restrict the usage of deprecated `NoopAnimationsModule`.

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
    "eslint-plugin-angular-modern/no-noopanimationsmodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

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
