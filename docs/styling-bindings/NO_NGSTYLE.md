# no-ngstyle

Restrict the usage of `NgStyle`.

Use native `[style]` instead.

## Documentation

- [NgStyle migration](https://angular.dev/reference/migrations/ngstyle-to-style)

## Configuration

- in the `recommended` preset
- in the `stylingBindings` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-ngstyle": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  imports: [NgStyle],
  template: `
    <div [ngStyle]="{ display: display(), overflow: overflow() }"></div>
  `,
})
export class SomeComponent {
  protected readonly display = signal<'block' | 'none'>('block');
  protected readonly overflow = signal<'visible' | 'hidden'>('visible');
}
```

## ✅ Valid

```typescript
@Component({
  template: `
    <div [style.display]="display()" [style.overflow]="overflow()"></div>
  `,
})
export class SomeComponent {
  protected readonly display = signal<'block' | 'none'>('block');
  protected readonly overflow = signal<'visible' | 'hidden'>('visible');
}
```

[Back to README](../../README.md)
