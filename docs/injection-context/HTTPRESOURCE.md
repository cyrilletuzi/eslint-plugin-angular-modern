# httpresource-in-injection-context

Checks that `httpResource()` is called inside an injection context, or that an explicit `Injector` is provided in the second argument, to avoid the `NG0203` runtime error.

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/httpresource-in-injection-context': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## Documentation

- [`httpResource()` API reference](https://angular.dev/api/common/http/httpResource)
- [Reactive data fetching guide](https://angular.dev/guide/http/http-resource)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## ❌ Invalid

All the invalid cases are without an injector. See the valid cases below to see an example of how to provide an explicit `Injector`.

- in lifecycle methods, notably `ngOnInit`
```typescript
@Component()
export class ProductPage implements OnInit {
  ngOnInit(): void {
    httpResource(() => '/some/api/path');
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
    httpResource(() => '/some/api/path');
  }
}
```

- in callbacks
```typescript
@Component()
export class ProductPage implements OnInit {
  ngOnInit(): void {
    somePromise().then(() => {
      httpResource(() => '/some/api/path');
    }).catch(() => {});  
  }
}
```

> [!NOTE]
> The rule reports both on asynchronous and synchronous callbacks, see the [known limitation documentation](./known-limitations/CALLBACKS.md).

- after awaiting (which is equivalent to be in a `.then()` callback)
```typescript
@Component()
export class ProductEditPage {
  async save(): Promise<void> {
    await somePromise();
    httpResource(() => '/some/api/path');
  }
}
```

- in non-Angular classes
```typescript
export class Product {
  constructor() {
    httpResource(() => '/some/api/path');
  }
}
```

- in standalone functions
```typescript
function someFunction(): void {
  httpResource(() => '/some/api/path');
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  constructor() {
    httpResource(() => '/some/api/path');
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  readonly productResourceRef = httpResource(() => '/some/api/path');
}
```

- when providing an explicit `Injector`
```typescript
@Component()
export class ProductPage implements OnInit {
  readonly #injector = inject(Injector);

  ngOnInit(): void {
    httpResource(() => '/some/api/path', {
      injector: this.#injector,
    });
  }
}
```

> [!NOTE]
> Prefer a literal object as in this example. If the second argument is a variable, the lint rule will not check if `injector` is actually present, see the [known limitation documentation](./known-limitations/INJECTOR_IN_VARIABLE.md).

- in explicit injection context
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  readonly #environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.#environmentInjector, () => {
      httpResource(() => '/some/api/path');
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
  httpResource(() => '/some/api/path', ...(injector ? { injector } : {}));
}
```

[Back to README](../../README.md)
