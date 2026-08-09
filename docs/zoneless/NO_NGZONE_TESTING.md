# no-ngzone-testing

Restrict the usage of `fixture.ngZone`.

It is useless and null in a zoneless application.

## Configuration

- in the `recommended` preset
- in the `zoneless` preset
```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-ngzone-testing": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
it('should...', () => {
  const fixture = TestBed.createComponent(SomeComponent);
  fixture.ngZone; 
});
```

[Back to README](../../README.md)
