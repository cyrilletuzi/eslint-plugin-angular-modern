# signal-form-in-injection-context

Checks that signal `form()` is called inside an injection context, or that an explicit `Injector` is provided in the second or third argument, to avoid the `NG0203` runtime error.

## Documentation

- [`form()` API reference](https://angular.dev/api/forms/signals/form)
- [Signal forms guide](https://angular.dev/essentials/signal-forms#)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/signal-form-in-injection-context': 'error'
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
  readonly #formModel = signal({
    name: '',
  });

  ngOnInit(): void {
    form(this.#formModel);
  }
}
```

- in any methods other than the constructor
```typescript
@Component()
export class ProductEditPage {
  readonly #formModel = signal({
    name: '',
  });

  someMethod(): void {
    form(this.#ormModel);
  }
}
```

- in callbacks
```typescript
@Component()
export class ProductPage implements OnInit {
  readonly #formModel = signal({
    name: '',
  });

  ngOnInit(): void {
    somePromise().then(() => {
      form(this.#formModel);
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
  readonly #formModel = signal({
    name: '',
  });

  async someMethod(): Promise<void> {
    await somePromise();
    form(this.#formModel);
  }
}
```

- in non-Angular classes
```typescript
export class Product {
  readonly #formModel = signal({
    name: '',
  });

  constructor() {
    form(this.#formModel);
  }
}
```

- in standalone functions
```typescript
function someFunction(): void {
  const formModel = signal({
    name: '',
  });
  form(this.formModel);
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  readonly #formModel = signal({
    name: '',
  });

  constructor() {
    form(this.#formModel);
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  readonly #formModel = signal({
    name: '',
  });
  protected readonly form = form(this.#formModel);
}
```

- when providing an explicit `Injector`
```typescript
@Component()
export class ProductPage implements OnInit {
  readonly #injector = inject(Injector);
  readonly #formModel = signal({
    name: '',
  });

  ngOnInit(): void {
    form(this.#formModel, { injector: this.#injector });
    // or
    form(this.#formModel, schema, { injector: this.#injector });
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
  readonly #formModel = signal({
    name: '',
  });

  someMethod() {
    runInInjectionContext(this.#environmentInjector, () => {
      form(this.#formModel);
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
  const formModel = signal({
    name: '',
  });
  form(this.formModel, injector ? { injector } : undefined);
}
```

[Back to README](../../README.md)
