# no-ngmodule-component

Restrict the usage of `standalone: false` in a component.

Use a standalone component instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngmodule-component': 'error'
  }
}
```

## ❌ Invalid

```typescript
@Component({
  standalone: false,
})
export class SomeComponent {}
```

## ✅ Valid

```typescript
@Component({})
export class SomeComponent {}
```

[View the test file for all valid and invalid cases](../../tests/rules/standalone/no-ngmodule-component.test.ts)

[Back to README](../../README.md)
