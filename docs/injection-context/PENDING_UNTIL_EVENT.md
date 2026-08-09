# pending-until-event-in-injection-context

Checks that `pendingUntilEvent()` is called inside an injection context, or that an explicit `Injector` is provided as first argument, to avoid the `NG0203` runtime error.

## Documentation

- [`pendingUntilEvent()` API reference](https://angular.dev/api/core/rxjs-interop/pendingUntilEvent)
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- in the `recommended` preset
- in the `injectionContext` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/pending-until-event-in-injection-context": "error"
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
export class App implements OnInit {
  ngOnInit(): void {
    someObservable().pipe(
      pendingUntilEvent(),
    ).subscribe();
  }
}
```

- in any methods other than the constructor
```typescript
@Component()
export class App {
  someMethod(): void {
    someObservable().pipe(
      pendingUntilEvent(),
    ).subscribe();
  }
}
```

- in callbacks
```typescript
@Component() 
export class App {
  private readonly dataObservable = someObservable.pipe(
    switchMap(() => someOtherObservable.pipe(pendingUntilEvent())),
  );
}
```

> [!NOTE]
> The rule reports both on asynchronous and synchronous callbacks, see the [known limitation documentation](./known-limitations/CALLBACKS.md).

- after awaiting (which is equivalent to be in a `.then()` callback)
```typescript
@Component()
export class App {
  async save(): Promise<void> {
    await somePromise();
    someObservable().pipe(
      pendingUntilEvent(),
    ).subscribe();
  }
}
```

- in non-Angular classes
```typescript
export class Product {
  private readonly obs = someObservable.pipe(pendingUntilEvent());
}
```

- in standalone functions
```typescript
function someFunction(): void {
  someObservable.pipe(pendingUntilEvent()).subscribe();
} 
```

## ✅ Valid

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class App {
  constructor() {
    someObservable.pipe(
      pendingUntilEvent(),
    ).subscribe();
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class App {
  private readonly obs = someObservable.pipe(pendingUntilEvent());
}
```

- when providing an explicit `Injector`
```typescript
@Component()
export class App implements OnInit {
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    someObservable.pipe(
      pendingUntilEvent(this.injector),
    ).subscribe();
  }
}
```

- in guards, resolvers and interceptors
```typescript
const authGuard: CanActivateFn = () => {
  return someObservable.pipe(pendingUntilEvent());
};
```

- in routes options involving a function:
```typescript
export const routes: Routes = [{
  path: 'some/path',
  redirectTo: () => someObservable.pipe(pendingUntilEvent()),
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
      someObservable.pipe(pendingUntilEvent()).subscribe();
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
  someObservable.pipe(pendingUntilEvent(injector)).subscribe();
}
```

[Back to README](../../README.md)
