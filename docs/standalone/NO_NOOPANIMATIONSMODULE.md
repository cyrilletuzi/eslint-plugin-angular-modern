# no-noopanimationsmodule

Restrict the usage of deprecated `NoopAnimationsModule`.

It is planned for removal; in the meantime, use `provideNoopAnimations()` or `provideAnimationsAsync('noop')` instead.

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
    'eslint-plugin-angular-modern/no-noopanimationsmodule': 'error'
  }
}
```

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

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-noopanimationsmodule.test.ts)

[Back to README](../../README.md)
