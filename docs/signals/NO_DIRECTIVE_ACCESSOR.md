# no-directive-accessor

Restrict the usage of public and protected getters and setters in components and directives.

In components and directives, a public or protected getter or setter can be bound to the UI. And in a zoneless application, a recomputation of it will not update the UI anymore. So:
- if it is indeed used in the UI, use `computed()` instead
- if it is only a property for the class itself, mark it as private (note: to use it in tests, TypeScript allows `componentInstance['privateProperty']`)

## Documentation

- [Signals guide](https://angular.dev/guide/signals)
- [`computed()` API reference](https://angular.dev/api/core/computed)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-directive-accessor': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  template: `{{ count }}`,
})
export class Products {
  private products = [];

  get count(): number {
    return this.products.length;
  }

  change(): void {
    this.products = ['Chocolate'];
  }
}
```

```typescript
@Component({
  template: `{{ count }}`,
})
export class Products {
  private products = [];

  public get count(): number {
    return this.products.length;
  }

  change(): void {
    this.products = ['Chocolate'];
  }
}
```

```typescript
@Component({
  template: `{{ count }}`,
})
export class Products {
  private products = [];

  protected get count(): number {
    return this.products.length;
  }

  change(): void {
    this.products = ['Chocolate'];
  }
}
```

```typescript
@Component({
  template: `{{ count }}`,
})
export class Products {
  set count(value: number) {
    return value;
  }
}
```

```typescript
@Directive()
export class Example {
  private products = [];

  get count(): number {
    return this.products.length;
  }

  change(): void {
    this.products = ['Chocolate'];
  }
}
```

## ✅ Valid

```typescript
@Component({
  template: `{{ count() }}`,
})
export class Products {
  private readonly products = signal<readonly string[]>([]);
  count = computed<number>(() => this.products().length);

  change(): void {
    this.products.set(['Chocolate']);
  }
}
```

```typescript
@Component({
  template: `{{ count() }}`,
})
export class Products {
  private readonly products = signal<readonly string[]>([]);
  public count = computed<number>(() => this.products().length);

  change(): void {
    this.products.set(['Chocolate']);
  }
}
```

```typescript
@Component({
  template: `{{ count() }}`,
})
export class Products {
  private readonly products = signal<readonly string[]>([]);
  protected count = computed<number>(() => this.products().length);

  change(): void {
    this.products.set(['Chocolate']);
  }
}
```

```typescript
@Component()
export class Profile {
  private get name(): string {
    return 'Elmo';
  }
}
```

```typescript
@Component()
export class Profile {
  get #name(): string {
    return 'Elmo';
  }
}
```

```typescript
@Directive()
export class Example {
  private readonly products = signal<readonly string[]>([]);
  count = computed<number>(() => this.products().length);

  change(): void {
    this.products.set(['Chocolate']);
  }
}
```

[Back to README](../../README.md)
