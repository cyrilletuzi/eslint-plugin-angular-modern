# no-candeactivate-class

Restrict the usage of `CanDeactivate` which was the way to declare a legacy class-based guard.

Use `CanDeactivateFn` with a functional guard instead.

## Documentation

- [Route guards guide](https://angular.dev/guide/routing/route-guards)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-candeactivate-class": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Injectable({
  providedIn: 'root',
})
export class UnsavedFormGuard implements CanDeactivate<SomeComponent> {
  canDeactivate(): boolean {
    return true;
  }
}
```

## ✅ Valid

```typescript
export const unsavedFormGuard: CanDeactivateFn<SomeComponent> = () => {
  return true;
};
```

[Back to README](../../README.md)
