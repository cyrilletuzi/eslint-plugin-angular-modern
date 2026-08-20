# no-canload-class

Restrict the usage of `CanLoad` which was the way to declare a legacy class-based guard, and is deprecated.

Use `CanMatchFn` with a functional guard instead.

## Documentation

- [Route guards guide](https://angular.dev/guide/routing/route-guards)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-canload-class': 'error'
  }
}
```

> [!TIP]
> This rule is _not_ in the `recommended` or the `functional` presets because `@typescript-eslint/no-deprecated` already reports this. See the [documentation](./DEPRECATED.md).

## ❌ Invalid

```typescript
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  canLoad(): boolean {
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
