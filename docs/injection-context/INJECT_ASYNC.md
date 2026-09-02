# inject-async-in-injection-context

Checks that `injectAsync()` is called inside an injection context, to avoid the `NG0203` runtime error.

## Documentation

- [`injectAsync()` API reference](https://next.angular.dev/api/core/injectAsync)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/inject-async-in-injection-context': 'error'
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
  ngOnInit(): void {
    injectAsync(() => import('./product-api').then((m) => m.ProductApi));
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
    injectAsync(() => import('./product-api').then((m) => m.ProductApi));
  }
}
```

- in callbacks
```typescript
@Component() 
export class ProductPage {
  readonly #dataObservable = inject(ActivatedRoute).paramMap.pipe(
    map((paramMap) => paramMap.get('id') ?? '1'),
    switchMap((id) => injectAsync(() => import('./product-api').then((m) => m.ProductApi))),
  );
}
```

> [!NOTE]
> The rule reports both on asynchronous and synchronous callbacks, see the [known limitation documentation](./known-limitations/CALLBACKS.md).

- after awaiting (which is equivalent to be in a `.then()` callback)
```typescript
const myGuard: CanActivateFn = async () => {
  await someAsyncFunction();
  injectAsync(() => import('./auth').then((m) => m.Auth));
};
```

- in non-Angular classes
```typescript
export class Product {
  readonly #productApi = injectAsync(() => import('./product-api').then((m) => m.ProductApi));
}
```

- in standalone functions
```typescript
function someFunction(): void {
  injectAsync(() => import('./product-api').then((m) => m.ProductApi));
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  constructor() {
    const productApiAsync = injectAsync(() => import('./product-api').then((m) => m.ProductApi));
    productApiAsync().then((productApi) => {
      productApi.getProducts();
    });
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage implements OnInit {
  readonly #productApiAsync = injectAsync(() => import('./product-api').then((m) => m.ProductApi));

  ngOnInit(): void {
    this.#productApiAsync().then((productApi) => {
      productApi.getProducts();
    });
  }
}
```

- in guards, resolvers and interceptors
```typescript
const authGuard: CanActivateFn = async () => {
  const authAsync = injectAsync(() => import('./auth').then((m) => m.Auth));
  const auth = await authAsync();
  return auth.isAuthenticated;
};
```

- in routes options involving a function:
```typescript
export const routes: Routes = [{
  path: 'some/path',
  redirectTo: async () => {
    const authAsync = injectAsync(() => import('./auth').then((m) => m.Auth));
    const auth = await authAsync();
    return auth.data === 'secret' ? '/secret/path' : '/some/other/path';
  },
}];
```

> [!NOTE]
> For some route options, injection context is only available from certain Angular versions, see the [known limitation documentation](./known-limitations/ROUTE_OPTIONS.md).

- in explicit injection context
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  readonly #environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.#environmentInjector, () => {
      injectAsync(() => import('./auth').then((m) => m.Auth));
    });
  }
}
```

> [!NOTE]
> The rule only detects `runInInjectionContext()` or `TestBed.runInInjectionContext()` in the current function, see the [known limitation documentation](./known-limitations/RUN_IN_INJECTION_CONTEXT.md).

- when asserted
```typescript
function customOperator(destroyRef?: DestroyRef) {
  assertInInjectionContext(customOperator);
  injectAsync(() => import('./auth').then((m) => m.Auth));
}
```

[Back to README](../../README.md)
