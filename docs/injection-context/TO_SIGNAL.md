# to-signal-in-injection-context

Checks that `toSignal()` is called inside an injection context, or that an explicit `Injector` is provided in the second argument, or that `manualCleanup` is enabled, to avoid the `NG0203` runtime error.

## Documentation

- [`toSignal()` API reference](https://angular.dev/api/core/resource)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/to-signal-in-injection-context': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

All the invalid cases are without an injector or manual cleanup. See the valid cases below to see an example of how to provide an explicit `Injector` or enable manual cleanup.

- in lifecycle methods, notably `ngOnInit`
```typescript
@Component()
export class ProductPage implements OnInit {
  ngOnInit(): void {
    toSignal(someObservable);
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
    toSignal(someObservable);
  }
}
```

- in callbacks
```typescript
@Component()
export class ProductPage implements OnInit {
  ngOnInit(): void {
    somePromise().then(() => {
      toSignal(someObservable);
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
    toSignal(someObservable);
  }
}
```

- in non-Angular classes
```typescript
export class Product {
  constructor() {
    toSignal(someObservable);
  }
}
```

- in standalone functions
```typescript
function someFunction(): void {
  toSignal(someObservable);
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  constructor() {
    toSignal(someObservable);
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  readonly #someSignal = toSignal(someObservable);
}
```

- when providing an explicit `Injector`
```typescript
@Component()
export class ProductPage implements OnInit {
  readonly #injector = inject(Injector);

  ngOnInit(): void {
    toSignal(someObservable, {
      injector: this.#injector,
    });
  }
}
```

> [!NOTE]
> Prefer a literal object as in this example. If the second argument is a variable, the lint rule will not check if `injector` is actually present, see the [known limitation documentation](./known-limitations/INJECTOR_IN_VARIABLE.md).

- when enabling manual cleanup (be careful with this option)
```typescript
@Component()
export class ProductPage implements OnInit {
  ngOnInit(): void {
    toSignal(someObservable, {
      manualCleanup: true,
    });
  }
}
```

- in explicit injection context
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  readonly #environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.#environmentInjector, () => {
      toSignal(someObservable);
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
  toSignal(someObservable);
}
```

[Back to README](../../README.md)
