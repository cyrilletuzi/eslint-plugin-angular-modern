# no-canmatch-class

Restrict the usage of `CanMatch` which was the way to declare a legacy class-based guard.

Use `CanMatchFn` with a functional guard instead.

## Documentation

- [Route guards guide](https://angular.dev/guide/routing/route-guards)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-canmatch-class': 'error'
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
export class AuthGuard implements CanMatch {
  canMatch(): boolean {
    return true;
  }
}
```

## ✅ Valid

```typescript
export const authGuard: CanMatchFn = () => {
  return true;
};
```

[Back to README](../../README.md)
