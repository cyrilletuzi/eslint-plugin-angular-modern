# decorator

Restrict the usage of legacy `@Injectable()`.

Use `@Service()` instead.

## Documentation

- [Dependency injection guide](https://angular.dev/guide/di)

## Configuration

- in the `recommended` preset
- in the `dependencyInjection` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/decorator": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Injectable({
  providedIn: 'root',
})
export class SomeService {}
```

```typescript
@Injectable()
export class SomeService {}
```

```typescript
@Injectable({
  providedIn: 'root',
  useFactory: () => {
    // Build and return something
  },
})
export class SomeService {}
```

```typescript
@Injectable({
  providedIn: 'root',
  useValue: '',
})
export class SomeService {}
```

```typescript
@Injectable({
  providedIn: 'root',
  useClass: SomeClass,
})
export class SomeService {}
```

## ✅ Valid

```typescript
@Service()
export class SomeService {}
```

```typescript
@Service({
  autoProvided: false,
})
export class SomeService {}

@Service({
  factory: () => {
    // Build and return something
  },
})
export class SomeService {}
```

```typescript
@Service({
  factory: () => '',
})
export class SomeService {}
```

```typescript
@Service({
  factory: () => SomeClass,
})
export class SomeService {}
```

```typescript
@Injectable({
  providedIn: 'platform',
})
export class SomeService {}
```

[Back to README](../../README.md)
