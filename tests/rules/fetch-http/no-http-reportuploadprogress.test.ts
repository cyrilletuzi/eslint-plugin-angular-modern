import * as rule from "../../../src/rules/fetch-http/no-http-reportuploadprogress.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpReportuploadprogress" } as const;

testRule(rule, {
  valid: [
    /* Modern replacement option (and the other progress options are not this rule concern) */
    `this.httpClient.post('/api', body, { reportProgress: true, reportDownloadProgress: true });`,
    `const options: HttpClientCommonOptions = { reportProgress: true, reportDownloadProgress: true };`,
    `const options: HttpRequestOptions = { reportProgress: true, reportDownloadProgress: true };`,
    /* Look-alike keys */
    `this.httpClient.get('/api', { reportUploadProgresses: true, reportuploadprogress: true });`,
    /* Parent is not an ObjectExpression (destructuring) */
    `const { reportUploadProgress } = options;`,
    `function f({ reportUploadProgress }: Options) {}`,
    /* Type declarations are not Property nodes */
    `interface O { reportUploadProgress: boolean; }`,
    /* Class property */
    `class A { reportUploadProgress = true; }`,
    /* Member access / assignment */
    `options.reportUploadProgress = true;`,
    /* Case 1 negative: object in a call to a method not in the HTTP methods list */
    `this.httpClient.jsonp('/api', { reportUploadProgress: true });`,
    `req.clone({ reportUploadProgress: true });`,
    `this.httpClient.Get('/api', { reportUploadProgress: true });`,
    /* Case 1 negative: callee is not a MemberExpression */
    `get('/api', { reportUploadProgress: true });`,
    /* Case 1 negative: computed method name with a string literal */
    `this.httpClient['get']('/api', { reportUploadProgress: true });`,
    /* Case 1 negative: object not a direct argument of the call */
    `this.httpClient.get('/api', { options: { reportUploadProgress: true } });`,
    `this.httpClient.get('/api', { ...{ reportUploadProgress: true } });`,
    `this.httpClient.get('/api', [{ reportUploadProgress: true }]);`,
    `this.httpClient.get('/api', cond ? { reportUploadProgress: true } : {});`,
    /* Case 2 negative: variable without type or with another type */
    `const options = { reportUploadProgress: true };`,
    `const options: Options = { reportUploadProgress: true };`,
    `const options: HttpClientCommonOption = { reportUploadProgress: true };`,
    /* Case 2 negative: type is not a simple TSTypeReference with Identifier name */
    `const options: ng.HttpRequestOptions = { reportUploadProgress: true };`,
    `const options: Partial<HttpRequestOptions> = { reportUploadProgress: true };`,
    `const options: HttpRequestOptions | undefined = { reportUploadProgress: true };`,
    /* Case 2 negative: object not directly the variable initializer */
    `const options = { reportUploadProgress: true } as HttpRequestOptions;`,
    `const options = { reportUploadProgress: true } satisfies HttpRequestOptions;`,
    `let options: HttpRequestOptions; options = { reportUploadProgress: true };`,
    `const options: HttpRequestOptions = { context: { reportUploadProgress: true } };`,
    /* Case 2 negative: typed class property (PropertyDefinition, not VariableDeclarator) */
    `class A { options: HttpRequestOptions = { reportUploadProgress: true }; }`,
    /* Case 3 negative: another class */
    `const req = new OtherRequest('POST', '/api', body, { reportUploadProgress: true });`,
    /* Computed key with a variable is not the `reportUploadProgress` property */
    `this.httpClient.get('/api', { [reportUploadProgress]: true });`,
  ],
  invalid: [
    /* Case 1: each HTTP method */
    { code: `this.httpClient.get('/api', { reportUploadProgress: true });`, errors: [error] },
    { code: `this.httpClient.post('/api', body, { reportUploadProgress: true });`, errors: [error] },
    { code: `this.httpClient.put('/api', body, { reportUploadProgress: true });`, errors: [error] },
    { code: `this.httpClient.delete('/api', { reportUploadProgress: true });`, errors: [error] },
    { code: `this.httpClient.patch('/api', body, { reportUploadProgress: true });`, errors: [error] },
    { code: `this.httpClient.head('/api', { reportUploadProgress: true });`, errors: [error] },
    { code: `this.httpClient.options('/api', { reportUploadProgress: true });`, errors: [error] },
    { code: `this.httpClient.request('POST', '/api', { reportUploadProgress: true });`, errors: [error] },
    /* Case 1: other callee shapes */
    { code: `http.get('/api', { reportUploadProgress: true });`, errors: [error] },
    { code: `inject(HttpClient).get('/api', { reportUploadProgress: true });`, errors: [error] },
    { code: `this.#http.get<Data>('/api', { reportUploadProgress: true });`, errors: [error] },
    { code: `this.http?.get('/api', { reportUploadProgress: true });`, errors: [error] },
    /* Case 1: `false` value, shorthand and other keys are still reported */
    { code: `http.get('/api', { reportUploadProgress: false });`, errors: [error] },
    { code: `http.get('/api', { observe: 'events', reportUploadProgress });`, errors: [error] },
    /* Case 1: method name is the only heuristic, any object with such a method matches */
    { code: `map.get({ reportUploadProgress: true });`, errors: [error] },
    /* Case 2: each options type */
    { code: `const options: HttpClientCommonOptions = { reportUploadProgress: true };`, errors: [error] },
    { code: `const options: HttpRequestOptions = { reportUploadProgress: true };`, errors: [error] },
    { code: `let options: HttpRequestOptions = { reportUploadProgress: true };`, errors: [error] },
    /* Case 2 then usage */
    {
      code: `const options: HttpRequestOptions = { reportUploadProgress: true }; this.httpClient.post('/api', body, options);`,
      errors: [error],
    },
    /* Several reports */
    {
      code: `http.get('/a', { reportUploadProgress: true }); http.post('/b', body, { reportUploadProgress: true });`,
      errors: [error, error],
    },
    // Quoted `reportUploadProgress` key
    { code: `this.httpClient.get('/api', { 'reportUploadProgress': true });`, errors: [error] },
    // Computed key with a string
    { code: `this.httpClient.get('/api', { ['reportUploadProgress']: true });`, errors: [error] },
    /* Case 3: `new HttpRequest()`, options as 4th argument (with body) or 3rd argument (without body) */
    { code: `const req = new HttpRequest('POST', '/api', body, { reportUploadProgress: true });`, errors: [error] },
    { code: `const req = new HttpRequest('GET', '/api', { reportUploadProgress: true });`, errors: [error] },
  ],
});
