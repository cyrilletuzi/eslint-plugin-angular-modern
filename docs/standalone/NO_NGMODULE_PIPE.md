# no-ngmodule-pipe

Restrict the usage of `standalone: false` in a pipe.

Use a standalone pipe instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngmodule-pipe': 'error'
  }
}
```

## ❌ Invalid

```typescript
@Pipe({
  standalone: false,
})
export class SomePipe {}
```

## ✅ Valid

```typescript
@Pipe({})
export class SomePipe {}
```

[Back to README](../../README.md)
