# Injector in variable

This known limitation is a false negative.

For functions accepting an explicit injection context in an object argument, the lint rules can only check the `injector` property is actually present if the argument is a literal object:

```typescript
toSignal(someObservable, { injector });
```

If the argument is a variable, the lint rules will suppose it is OK, even if the object is actually missing the `injector` property:
```typescript
const options = { injector };
toSignal(someObservable, options); // Lint OK, runtime OK

const options = { otherOption };
toSignal(someObservable, options); // Lint OK, runtime KO if outside of injection context
```

Checking the variable is possible, but it would require [typed linting](https://typescript-eslint.io/getting-started/typed-linting), which adds a requirement, is slower, and is more complicated to implement.

It may be added in the future, but for now, given the most common usage is using a literal object, it is not seen as worth the effort.

[Back to README](../../../README.md)
