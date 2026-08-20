# to-observable-in-injection-context

Checks that `toObservable()` is called inside an injection context, or that an explicit `Injector` is provided in the second argument, to avoid the `NG0203` runtime error.

## Documentation

- [`toObservable()` API reference](https://angular.dev/api/core/rxjs-interop/toObservable)
- [RxJS interop guide](https://angular.dev/ecosystem/rxjs-interop)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/to-observable-in-injection-context': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

All the invalid cases are without an injector. See the valid cases below to see an example of how to provide an explicit `Injector`.

- in lifecycle methods, notably `ngOnInit`
```typescript
@Component()
export class ProductPage implements OnInit {
  private readonly id = signal(0);

  ngOnInit(): void {
    toObservable(this.id);
  }
}
```

- in any methods other than the constructor
```typescript
@Component({
  template: `<form (submit)="save()"></form>`
})
export class ProductEditPage {
  private readonly id = signal(0);

  save(): void {
    toObservable(this.id);
  }
}
```

- in callbacks
```typescript
@Component() 
export class ProductPage {
  private readonly id = signal(0);
  private readonly dataObservable = someObservable.pipe(
    switchMap(() => toObservable(this.id)),
  );
}
```

> [!NOTE]
> The rule reports both on asynchronous and synchronous callbacks, see the [known limitation documentation](./known-limitations/CALLBACKS.md).

- after awaiting (which is equivalent to be in a `.then()` callback)
```typescript
const id = signal(0);
const myGuard: CanActivateFn = async () => {
  await someAsyncFunction();
  return toObservable(id);
};
```

- in non-Angular classes
```typescript
export class Product {
  private readonly id = signal(0);
  private readonly idObservable = toObservable(this.id);
}
```

- in standalone functions
```typescript
function someFunction(): void {
  const id = signal(0);
  toObservable(id);
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  private readonly id = signal(0);

  constructor() {
    toObservable(this.id);
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  private readonly id = signal(0);
  private readonly idObservable = toObservable(this.id);
}
```

- when providing an explicit `Injector`
```typescript
@Component()
export class ProductPage implements OnInit {
  private readonly injector = inject(Injector);
  private readonly id = signal(0);

  ngOnInit(): void {
    toObservable(this.id, { injector: this.injector });
  }
}
```

- in guards, resolvers and interceptors
```typescript
const isAuthenticated = signal(false);
const authGuard: CanActivateFn = () => {
  return toObservable(isAuthenticated);
};
```

- in routes options involving a function:
```typescript
const redirectPath = signal('/some/path');
export const routes: Routes = [{
  path: 'some/path',
  redirectTo: () => toObservable(redirectPath),
}];
```

> [!NOTE]
> For some route options, injection context is only available from certain Angular versions, see the [known limitation documentation](./known-limitations/ROUTE_OPTIONS.md).

- in some providers during app initialization:
  - `provideAppInitializer()`

- in explicit injection context
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly id = signal(0);
  private readonly environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      toObservable(this.id)
    });
  }
}
```

> [!NOTE]
> The rule only detects `runInInjectionContext()` or `TestBed.runInInjectionContext()` in the current function, see the [known limitation documentation](./known-limitations/RUN_IN_INJECTION_CONTEXT.md).

- when asserted
```typescript
function customOperator(injector: Injector) {
  if (!injector) {
    assertInInjectionContext(customOperator);
  }
  const id = signal(0);
  toObservable(id, injector ? { injector } : undefined);
}
```

[Back to README](../../README.md)
