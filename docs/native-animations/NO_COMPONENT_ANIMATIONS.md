# no-component-animations

Restrict the usage of `animations` in components, which rely on deprecated `@angular/animations`.

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
    'eslint-plugin-angular-modern/no-component-animations': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  template: `
    @if (isShown()) {
      <div @fade>Content</div>
    }
  `,
})
export class Example {}
```

## ✅ Valid

```typescript
@Component({
  template: `
    @if (isShown()) {
      <div animate.enter="fade-in">Content</div>
    }
  `,
  styles: `
    .fade-in {
      animation: fade-in 300ms;
    }
    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }
  `,
})
export class Example {}
```

[View the test file for all valid and invalid cases](../../tests/rules/native-animations/no-component-animations.test.ts)

[Back to README](../../README.md)
