# no-ngafterviewinit

Restrict the usage of `ngAfterViewInit`.

Resources and signals are designed to be reactive, so waiting manually for the `ngAfterViewInit` phase is not needed anymore. When really needed, use `afterNextRender()`.

## Documentation

- [Signals guide](https://angular.dev/guide/signals)
- [`afterNextRender()` API reference](https://angular.dev/api/core/afterNextRender)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ngafterviewinit': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component()
export class ProductsList implements AfterViewInit {
  readonly list = viewChildren.required<readonly ProductItem[]>();
  protected count = 0;

  ngAfterViewInit(): void {
    this.count = this.list().length;
  }
}
```

## ✅ Valid

```typescript
@Component()
export class ProductsList {
  readonly list = viewChildren.required<readonly ProductItem[]>();
  protected readonly count = computed(() => this.list().length);
}
```

```typescript
@Component()
export class SomeComponent {
  constructor() {
    afterNextRender(() => {
      // Do the very rare thing relying on render done
    });
  }
}
```

[Back to README](../../README.md)
