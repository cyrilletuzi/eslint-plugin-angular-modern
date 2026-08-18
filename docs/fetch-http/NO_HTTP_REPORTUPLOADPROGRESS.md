# no-http-reportuploadprogress

Restrict the usage of HttpClient `reportUploadProgress` option, which is not supported by fetch based HTTP and throws a runtime error.

## Documentation

- [HTTP guide](https://angular.dev/guide/http)

## Configuration

- in the `recommended` preset
- in the `fetchHttp` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-http-reportuploadprogress": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
this.httpClient.post('/some/api', body, {
  reportUploadProgress: true,
});
```

```typescript
const options: HttpClientCommonOptions = {
  reportUploadProgress: true,
};
this.httpClient.post('/some/api', body, options);
```

```typescript
const options: HttpRequestOptions = {
  reportUploadProgress: true,
};
this.httpClient.post('/some/api', body, options);
```

## ✅ Valid

```typescript
this.httpClient.post('/some/api', body);
```

```typescript
const options: HttpClientCommonOptions = {};
this.httpClient.post('/some/api', body, options);
```

```typescript
const options: HttpRequestOptions = {};
this.httpClient.post('/some/api', body, options);
```

[Back to README](../../README.md)
