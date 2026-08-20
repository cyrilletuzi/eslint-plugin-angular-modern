# take-until-destroyed-in-injection-context

Checks that `takeUntilDestroyed()` is called inside an injection context, or that an explicit `DestroyRef` is provided as an argument, to avoid the `NG0203` runtime error.

## Documentation

- [`takeUntilDestroyed()` API reference](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed)
- [Unsubscribing with takeUntilDestroyed guide](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/take-until-destroyed-in-injection-context': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

All the invalid cases are without a destroy ref. See the valid cases below to see an example of how to provide an explicit `DestroyRef`.

- in lifecycle methods, notably `ngOnInit`
```typescript
@Component()
export class ProductPage implements OnInit {
  ngOnInit(): void {
    getProduct().pipe(
      takeUntilDestroyed(),
    ).subscribe();
  }
}
```

- in any methods other than the constructor
```typescript
@Component({
  template: `<form (submit)="save()"></form>`
})
export class ProductEditPage {
  save(): void {
    saveProduct().pipe(
      takeUntilDestroyed(),
    ).subscribe();
  }
}
```

- in callbacks
```typescript
@Component() 
export class ProductPage {
  private readonly dataObservable = someObservable.pipe(
    switchMap(() => someOtherObservable.pipe(takeUntilDestroyed())),
  );
}
```

> [!NOTE]
> The rule reports both on asynchronous and synchronous callbacks, see the [known limitation documentation](./known-limitations/CALLBACKS.md).

- after awaiting (which is equivalent to be in a `.then()` callback)
```typescript
@Component()
export class ProductPage {
  async save(): Promise<void> {
    await somePromise();
    someObservable().pipe(
      takeUntilDestroyed(),
    ).subscribe();
  }
}
```

- in non-Angular classes
```typescript
export class Product {
  private readonly obs = someObservable.pipe(takeUntilDestroyed());
}
```

- in standalone functions
```typescript
function someFunction(): void {
  someObservable.pipe(takeUntilDestroyed()).subscribe();
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  constructor() {
    getProduct.pipe(
      takeUntilDestroyed(),
    ).subscribe();
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  private readonly obs = getProduct.pipe(takeUntilDestroyed());
}
```

- when providing an explicit `DestroyRef`
```typescript
@Component()
export class ProductPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    getProduct().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}
```

- in guards, resolvers and interceptors
```typescript
const authGuard: CanActivateFn = () => {
  return someObservable.pipe(takeUntilDestroyed());
};
```

- in routes options involving a function:
```typescript
export const routes: Routes = [{
  path: 'some/path',
  redirectTo: () => someObservable.pipe(takeUntilDestroyed()),
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
  private readonly environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      someObservable.pipe(takeUntilDestroyed()).subscribe();
    });
  }
}
```

> [!NOTE]
> The rule only detects `runInInjectionContext()` or `TestBed.runInInjectionContext()` in the current function, see the [known limitation documentation](./known-limitations/RUN_IN_INJECTION_CONTEXT.md).

- when asserted
```typescript
function customOperator(destroyRef: DestroyRef) {
  if (!destroyRef) {
    assertInInjectionContext(customOperator);
  }
  someObservable.pipe(takeUntilDestroyed(destroyRef)).subscribe();
}
```

[Back to README](../../README.md)
