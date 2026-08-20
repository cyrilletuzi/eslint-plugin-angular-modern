# inject-in-injection-context

Checks that `inject()` is called inside an injection context, to avoid the `NG0203` runtime error.

## Documentation

- [`inject()` API reference](https://angular.dev/api/core/inject)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/inject-in-injection-context': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

- in lifecycle methods, notably `ngOnInit`
```typescript
@Component()
export class ProductPage implements OnInit {
  readonly id = input.required<number>();

  ngOnInit(): void {
    const productApi = inject(ProductApi);
    productApi.getProduct(this.id()).subscribe();
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
    const productApi = inject(ProductApi);
    productApi.saveProduct(this.id()).subscribe();
  }
}
```

- in callbacks
```typescript
@Component() 
export class ProductPage {
  private readonly dataObservable = inject(ActivatedRoute).paramMap.pipe(
    map((paramMap) => paramMap.get('id') ?? '1'),
    switchMap((id) => inject(ProductsApi).getProduct(id)),
  );
}
```

> [!NOTE]
> The rule reports both on asynchronous and synchronous callbacks, see the [known limitation documentation](./known-limitations/CALLBACKS.md).

- after awaiting (which is equivalent to be in a `.then()` callback)
```typescript
const myGuard: CanActivateFn = async () => {
  await someAsyncFunction();
  const someService = inject(SomeService);
  return someService.isOK;
};
```

- in non-Angular classes
```typescript
export class Product {
  private readonly productApi = inject(ProductApi);
}
```

- in standalone functions
```typescript
function someFunction(): void {
  const someService = inject(SomeService);
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  constructor() {
    const productApi = inject(ProductApi);
    productApi.getProducts().subscribe();
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage implements OnInit {
  readonly id = input.required<number>();
  private readonly productApi = inject(ProductApi);

  ngOnInit(): void {
    this.productApi.getProduct(this.id()).subscribe();
  }
}
```

- in guards, resolvers and interceptors
```typescript
const authGuard: CanActivateFn = () => {
  const authService = inject(authService)
  return authService.isAuthenticated;
};
```

- in routes options involving a function:
```typescript
export const routes: Routes = [{
  path: 'some/path',
  redirectTo: () => {
    const someService = inject(SomeService);
    return someService.data === 'secret' ? '/secret/path' : '/some/other/path';
  },
}];
```

> [!NOTE]
> For some route options, injection context is only available from certain Angular versions, see the [known limitation documentation](./known-limitations/ROUTE_OPTIONS.md).

- in injection tokens
```typescript
const MY_TOKEN = new InjectionToken('my-token', {
  factory: () => {
    const someService = inject(SomeService);
    return someService.data;
  },
});
```

- in providers and injectables factories
```typescript
const provider: Provider = {
  provide: SOME_TOKEN,
  useFactory: () => {
    const someService = inject(SomeService);
    return someService.data;
  },
};
```

- in some providers during app initialization:
  - `provideAppInitializer()`
  - `providePlatformInitializer()`
  - `provideEnvironmentInitializer()`
  - `withViewTransitions()` `onViewTransitionCreated`

- in explicit injection context
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      const someService = inject(SomeService);
    });
  }
}
```

> [!NOTE]
> The rule only detects `runInInjectionContext()` or `TestBed.runInInjectionContext()` in the current function, see the [known limitation documentation](./known-limitations/RUN_IN_INJECTION_CONTEXT.md).

- when asserted
```typescript
function customOperator(destroyRef?: DestroyRef) {
  if (!destroyRef) {
    assertInInjectionContext(customOperator);
  }
  destroyRef ??= inject(DestroyRef);
}
```

[Back to README](../../README.md)
