# no-ngmodule-directive

Restrict the usage of `standalone: false` in a directive.

Use a standalone directive instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngmodule-directive': 'error'
  }
}
```

## ❌ Invalid

```typescript
@Directive({
  standalone: false,
})
export class SomeDirective {}
```

## ✅ Valid

```typescript
@Directive({})
export class SomeDirective {}
```

[Back to README](../../README.md)
