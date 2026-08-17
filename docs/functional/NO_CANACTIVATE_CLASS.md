# no-canactivate-class

Restrict the usage of `CanActivate` which was the way to declare a legacy class-based guard.

Use `CanActivateFn` with a functional guard instead.

## Documentation

- [Route guards guide](https://angular.dev/guide/routing/route-guards)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-canactivate-class": "error"
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
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
```

## ✅ Valid

```typescript
export const authGuard: CanActivateFn = () => {
  return true;
};
```

[Back to README](../../README.md)
