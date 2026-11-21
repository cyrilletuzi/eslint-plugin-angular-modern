# no-platformbrowser-animations-import

Restrict the import of deprecated `@angular/platform-browser/animations` (including `@angular/platform-browser/animations/async`), which provides `provideAnimations()`, `provideAnimationsAsync()` and `provideNoopAnimations()`.

These providers are only needed by deprecated `@angular/animations`.

> [!IMPORTANT]
> Remove the animations providers only once no component uses `@angular/animations` anymore (see the [no-animations-import](./NO_ANIMATIONS_IMPORT.md) and [no-component-animations](./NO_COMPONENT_ANIMATIONS.md) rules), otherwise remaining animations fail at runtime.

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
    'eslint-plugin-angular-modern/no-platformbrowser-animations-import': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
  ],
};
```

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNoopAnimations(),
  ],
};
```

```typescript
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
  ],
};
```

## ✅ Valid

See the [no-component-animations](./NO_COMPONENT_ANIMATIONS.md) rule for an example of native CSS animations.

[View the test file for all valid and invalid cases](../../tests/rules/native-animations/no-platformbrowser-animations-import.test.ts)

[Back to README](../../README.md)
