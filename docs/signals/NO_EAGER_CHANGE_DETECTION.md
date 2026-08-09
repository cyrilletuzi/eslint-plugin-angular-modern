# no-eager-change-detection

Restrict the usage of `ChangeDetectionStrategy.Eager` and `ChangeDetectionStrategy.Default`.

Use `ChangeDetectionStrategy.OnPush` instead (it is the default in Angular >= 22).

> [!NOTE]
> This rule was done with Angular >= 22 in mind, it does not detect that `ChangeDetectionStrategy.OnPush` is explicitly set in Angular <= 21 projects. 

## Documentation

- [`ChangeDetectionStrategy()` API reference](https://angular.dev/api/core/ChangeDetectionStrategy)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-eager-change-detection": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SomeComponent {}
```

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SomeComponent {}
```

## ✅ Valid

- in Angular >= 22
```typescript
@Component()
export class SomeComponent {}
```

- in Angular <= 21
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SomeComponent {}
```

[Back to README](../../README.md)
