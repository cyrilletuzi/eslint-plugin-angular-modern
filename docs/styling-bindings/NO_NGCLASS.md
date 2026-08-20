# no-ngclass

Restrict the usage of `NgClass`.

Use native `[class]` instead.

## Documentation

- [NgClass migration](https://angular.dev/reference/migrations/ngclass-to-class)

## Configuration

- in the `recommended` preset
- in the `stylingBindings` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngclass': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  imports: [NgClass],
  template: `
    <div [ngClass]="{ valid: isValid(), disabled: isDisabled() }"></div>
  `,
})
export class SomeComponent {
  protected readonly isValid = signal(false);
  protected readonly isDisabled = signal(false);
}
```

## ✅ Valid

```typescript
@Component({
  template: `
    <div [class.valid]="valid()" [class.disabled]="isDisabled()"></div>
  `,
})
export class SomeComponent {
  protected readonly isValid = signal(false);
  protected readonly isDisabled = signal(false);
}
```

[Back to README](../../README.md)
