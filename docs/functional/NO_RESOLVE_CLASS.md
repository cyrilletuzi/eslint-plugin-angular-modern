# no-resolve-class

Restrict the usage of `Resolve` which was the way to declare a legacy class-based resolver.

Use `ResolveFn` with a functional resolver instead.

## Documentation

- [Data resolvers guide](https://angular.dev/guide/routing/data-resolvers)

## Configuration

- in the `recommended` preset
- in the `functional` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-resolve-class': 'error'
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
export class SomeResolver implements Resolve<SomeData> {
  resolve(): SomeData {
    return someData;
  }
}
```

## ✅ Valid

```typescript
export const someResolver: ResolveFn<SomeData> = () => {
  return someData;
};
```

[Back to README](../../README.md)
