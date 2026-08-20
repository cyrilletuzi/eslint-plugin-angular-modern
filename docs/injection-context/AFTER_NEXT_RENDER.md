# after-next-render-in-injection-context

Checks that `afterNextRender()` is called inside an injection context, or that an explicit `Injector` is provided in the second argument, to avoid the `NG0203` runtime error.

## Documentation

- [`afterNextRender()` API reference](https://angular.dev/api/core/afterNextRender)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/after-next-render-in-injection-context': 'error'
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
  ngOnInit(): void {
    afterNextRender(() => {});
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
    afterNextRender(() => {});
  }
}
```

- in callbacks
```typescript
@Component() 
export class ProductPage {
  private readonly dataObservable = someObservable.pipe(
    tap(() => {
      afterNextRender(() => {});
    }),
  );
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
    afterNextRender(() => {});
  }
}
```

- in non-Angular classes
```typescript
export class Product {
  constructor() {
    afterNextRender(() => {});
  }
}
```

- in standalone functions
```typescript
function someFunction(): void {
  afterNextRender(() => {});
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  constructor() {
    afterNextRender(() => {});
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  private readonly someProperty = afterNextRender(() => {});
}
```

- when providing an explicit `Injector`
```typescript
@Component()
export class ProductPage implements OnInit {
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    afterNextRender(() => {}, { injector: this.injector });
  }
}
```

> [!NOTE]
> Prefer a literal object as in this example. If the second argument is a variable, the lint rule will not check if `injector` is actually present, see the [known limitation documentation](./known-limitations/INJECTOR_IN_VARIABLE.md).

- in explicit injection context
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      afterNextRender(() => {});
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
  afterNextRender(() => {}, injector ? { injector } : undefined);
}
```

[Back to README](../../README.md)
