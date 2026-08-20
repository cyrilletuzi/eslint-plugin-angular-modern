# no-canactivatechild-class

Restrict the usage of `CanActivateChild` which was the way to declare a legacy class-based guard.

Use `CanActivateChildFn` with a functional guard instead.

## Documentation

- [Route guards guide](https://angular.dev/guide/routing/route-guards)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-canactivatechild-class': 'error'
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
export class AuthGuard implements CanActivateChild {
  canActivateChild(): boolean {
    return true;
  }
}
```

## ✅ Valid

```typescript
export const authGuard: CanActivateChildFn = () => {
  return true;
};
```

[Back to README](../../README.md)
