# no-material-modules

Restrict the usage of Material modules.

Use Material standalone components and directives instead.

## Documentation

- [Material documentation](https://material.angular.dev)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-material-modules': 'error'
  }
}
```

> [!NOTE]
> This rule must be enabled individually and is not enabled in the `standalone` or `recommended` presets because not all projects use Material.

## ❌ Invalid

```typescript
@Component({
  imports: [MatButtonModule],
  template: `<button matButton>Button</button>`,
})
export class SomeComponent {}
```

## ✅ Valid

```typescript
@Component({
  imports: [MatButton],
  template: `<button matButton>Button</button>`,
})
export class SomeComponent {}
```

[Back to README](../../README.md)
