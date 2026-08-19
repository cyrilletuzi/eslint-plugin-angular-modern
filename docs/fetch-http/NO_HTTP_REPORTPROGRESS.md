# no-http-reportprogress

Restrict the usage of HttpClient `reportProgress` deprecated option.

Use `reportDownloadProgress()` instead.

## Documentation

- [HTTP guide](https://angular.dev/guide/http)

## Configuration

> [!IMPORTANT]
> `reportDownloadProgress` was introduced in Angular 22, so this rule should only be disabled in previous versions.

- in the `recommended` preset
- in the `fetchHttp` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-http-reportprogress": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
this.httpClient.post('/some/api', body, {
  reportProgress: true,
});
```

```typescript
const options: HttpClientCommonOptions = {
  reportProgress: true,
};
this.httpClient.post('/some/api', body, options);
```

```typescript
const options: HttpRequestOptions = {
  reportProgress: true,
};
this.httpClient.post('/some/api', body, options);
```

## ✅ Valid

```typescript
this.httpClient.post('/some/api', body, {
  reportDownloadProgress: true,
});
```

```typescript
const options: HttpClientCommonOptions = {
  reportDownloadProgress: true,
};
this.httpClient.post('/some/api', body, options);
```

```typescript
const options: HttpRequestOptions = {
  reportDownloadProgress: true,
};
this.httpClient.post('/some/api', body, options);
```

[Back to README](../../README.md)
