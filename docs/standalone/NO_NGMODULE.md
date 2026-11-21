# no-ngmodule

Restrict the usage of `NgModule`.

Use standalone components, directives and pipes instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngmodule': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  standalone: false,
})
export class SomeComponent {}

@NgModule({
  declarations: [SomeComponent],
})
export class SomeModule {}
```

## ✅ Valid

```typescript
@Component()
export class SomeComponent {}
```

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-ngmodule.test.ts)

[Back to README](../../README.md)
