# no-animations-import

Restrict the import of deprecated `@angular/animations` (including its subpaths, like `@angular/animations/browser`).

Use native CSS animations with `animate.enter` and `animate.leave` instead.

## Documentation

- [Animations guide](https://angular.dev/guide/animations)
- [Animations migration](https://angular.dev/guide/animations/migration)

## Configuration

- in the `recommended` preset
- in the `nativeAnimations` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-animations-import': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
import { animate, style, transition, trigger } from '@angular/animations';
```

```typescript
import { AnimationBuilder } from '@angular/animations';
```

## ✅ Valid

See the [no-component-animations](./NO_COMPONENT_ANIMATIONS.md) rule for an example of native CSS animations.

[Back to README](../../README.md)
