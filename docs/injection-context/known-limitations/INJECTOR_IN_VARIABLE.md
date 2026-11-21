# Injector in variable

This known limitation is a false negative.

For functions accepting an explicit injection context in an object argument, the lint rules can check the `injector` property is actually present if the argument is a literal object, or a local `const` initialized with a literal object:

```typescript
toSignal(someObservable, { injector });

const options = { injector };
toSignal(someObservable, options); // Lint OK, runtime OK

const options = { otherOption };
toSignal(someObservable, options); // Lint KO, runtime KO if outside of injection context
```

If the argument is any other variable (an import, a parameter, a `let`, the result of a function...), the lint rules will suppose it is OK, even if the object is actually missing the `injector` property:
```typescript
import { options } from './options';

toSignal(someObservable, options); // Lint OK, runtime KO if `injector` is missing and outside of injection context
```

[Back to README](../../../README.md)
