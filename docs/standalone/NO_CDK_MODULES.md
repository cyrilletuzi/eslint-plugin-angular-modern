# no-cdk-modules

Restrict the usage of CDK modules.

Use CDK standalone components and directives instead.

## Documentation

- [CDK documentation](https://material.angular.dev/cdk/)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-cdk-modules': 'error'
  }
}
```

> [!NOTE]
> This rule must be enabled individually and is not enabled in the `standalone` or `recommended` presets because not all projects use the CDK.

## ❌ Invalid

```typescript
@Component({
  imports: [CdkMenuModule],
  template: `
    <div cdkMenu>
      <button cdkMenuItem>Cut</button>
      <button cdkMenuItem>Copy</button>
      <button cdkMenuItem>Link</button>
    </div>
  `,
})
export class SomeComponent {}
```

## ✅ Valid

```typescript
@Component({
  imports: [CdkMenu, CdkMenuItem],
  template: `
    <div cdkMenu>
      <button cdkMenuItem>Cut</button>
      <button cdkMenuItem>Copy</button>
      <button cdkMenuItem>Link</button>
    </div>
  `,
})
export class SomeComponent {}
```

[Back to README](../../README.md)
