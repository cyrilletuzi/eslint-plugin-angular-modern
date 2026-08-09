# no-detectchanges-testing

Restrict the usage of `fixture.detectChanges`.

Use `await fixture.whenStable()` instead.

## Documentation

- [`ComponentFixture.whenStable()` API reference](https://angular.dev/api/core/testing/ComponentFixture#whenStable)

## Configuration

- in the `recommended` preset
- in the `signals` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-detectchanges-testing": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
it('should...', () => {
  const fixture = TestBed.createComponent(SomeComponent);
  fixture.detectChanges(); 
});
```

## ✅ Valid

```typescript
it('should...', async () => {
  const fixture = TestBed.createComponent(SomeComponent);
  await fixture.whenStable(); 
});
```

[Back to README](../../README.md)
