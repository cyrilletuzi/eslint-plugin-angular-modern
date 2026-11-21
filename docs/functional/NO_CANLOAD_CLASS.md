# no-canload-class

Restrict the usage of `CanLoad` which was the way to declare a legacy class-based guard, and is deprecated.

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
    'eslint-plugin-angular-modern/no-canload-class': 'error'
  }
}
```

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

[View the test file for all valid and invalid cases](../../tests/rules/functional/no-canload-class.test.ts)

[Back to README](../../README.md)
