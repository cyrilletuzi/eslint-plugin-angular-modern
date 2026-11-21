import * as rule from "../../../src/rules/fetch-http/no-http-reportprogress.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpReportprogress" } as const;

testRule(rule, {
  valid: [
    /* Modern replacement option */
    `this.httpClient.post('/api', body, { reportDownloadProgress: true });`,
    `const options: HttpClientCommonOptions = { reportDownloadProgress: true };`,
    `const options: HttpRequestOptions = { reportDownloadProgress: true };`,
    /* Look-alike keys */
    `this.httpClient.get('/api', { reportProgresses: true, reportprogress: true });`,
    /* Parent is not an ObjectExpression (destructuring) */
    `const { reportProgress } = options;`,
    `function f({ reportProgress }: Options) {}`,
    /* Type declarations are not Property nodes */
    `interface O { reportProgress: boolean; }`,
    /* Class property */
    `class A { reportProgress = true; }`,
    /* Member access / assignment */
    `options.reportProgress = true;`,
    /* Case 1 negative: object in a call to a method not in the HTTP methods list */
    `this.httpClient.jsonp('/api', { reportProgress: true });`,
    `req.clone({ reportProgress: true });`,
    `this.httpClient.Get('/api', { reportProgress: true });`,
    /* Case 1 negative: callee is not a MemberExpression */
    `get('/api', { reportProgress: true });`,
    /* Case 1 negative: computed method name with a string literal */
    `this.httpClient['get']('/api', { reportProgress: true });`,
    /* Case 1 negative: object not a direct argument of the call */
    `this.httpClient.get('/api', { options: { reportProgress: true } });`,
    `this.httpClient.get('/api', { ...{ reportProgress: true } });`,
    `this.httpClient.get('/api', [{ reportProgress: true }]);`,
    `this.httpClient.get('/api', cond ? { reportProgress: true } : {});`,
    /* Case 2 negative: variable without type or with another type */
    `const options = { reportProgress: true };`,
    `const options: Options = { reportProgress: true };`,
    `const options: HttpClientCommonOption = { reportProgress: true };`,
    /* Case 2 negative: type is not a simple TSTypeReference with Identifier name */
    `const options: ng.HttpRequestOptions = { reportProgress: true };`,
    `const options: Partial<HttpRequestOptions> = { reportProgress: true };`,
    `const options: HttpRequestOptions | undefined = { reportProgress: true };`,
    /* Case 2 negative: object not directly the variable initializer */
    `const options = { reportProgress: true } as HttpRequestOptions;`,
    `const options = { reportProgress: true } satisfies HttpRequestOptions;`,
    `let options: HttpRequestOptions; options = { reportProgress: true };`,
    `const options: HttpRequestOptions = { context: { reportProgress: true } };`,
    /* Case 2 negative: typed class property (PropertyDefinition, not VariableDeclarator) */
    `class A { options: HttpRequestOptions = { reportProgress: true }; }`,
    /* Case 3 negative: another class */
    `const req = new OtherRequest('POST', '/api', body, { reportProgress: true });`,
  ],
  invalid: [
    /* Case 1: each HTTP method */
    { code: `this.httpClient.get('/api', { reportProgress: true });`, errors: [error] },
    { code: `this.httpClient.post('/api', body, { reportProgress: true });`, errors: [error] },
    { code: `this.httpClient.put('/api', body, { reportProgress: true });`, errors: [error] },
    { code: `this.httpClient.delete('/api', { reportProgress: true });`, errors: [error] },
    { code: `this.httpClient.patch('/api', body, { reportProgress: true });`, errors: [error] },
    { code: `this.httpClient.head('/api', { reportProgress: true });`, errors: [error] },
    { code: `this.httpClient.options('/api', { reportProgress: true });`, errors: [error] },
    { code: `this.httpClient.request('POST', '/api', { reportProgress: true });`, errors: [error] },
    /* Case 1: other callee shapes */
    { code: `http.get('/api', { reportProgress: true });`, errors: [error] },
    { code: `inject(HttpClient).get('/api', { reportProgress: true });`, errors: [error] },
    { code: `this.#http.get<Data>('/api', { reportProgress: true });`, errors: [error] },
    { code: `this.http?.get('/api', { reportProgress: true });`, errors: [error] },
    /* Case 1: `false` value, shorthand and other keys are still reported */
    { code: `http.get('/api', { reportProgress: false });`, errors: [error] },
    { code: `http.get('/api', { observe: 'events', reportProgress });`, errors: [error] },
    /* Case 1: method name is the only heuristic, any object with such a method matches */
    { code: `map.get({ reportProgress: true });`, errors: [error] },
    /* Case 2: each options type */
    { code: `const options: HttpClientCommonOptions = { reportProgress: true };`, errors: [error] },
    { code: `const options: HttpRequestOptions = { reportProgress: true };`, errors: [error] },
    { code: `let options: HttpRequestOptions = { reportProgress: true };`, errors: [error] },
    /* Case 2 then usage */
    {
      code: `const options: HttpRequestOptions = { reportProgress: true }; this.httpClient.post('/api', body, options);`,
      errors: [error],
    },
    /* Several reports */
    {
      code: `http.get('/a', { reportProgress: true }); http.post('/b', body, { reportProgress: true });`,
      errors: [error, error],
    },
    // Quoted `reportProgress` key
    { code: `this.httpClient.get('/api', { 'reportProgress': true });`, errors: [error] },
    /* Case 3: `new HttpRequest()`, options as 4th argument (with body) or 3rd argument (without body) */
    { code: `const req = new HttpRequest('POST', '/api', body, { reportProgress: true });`, errors: [error] },
    { code: `const req = new HttpRequest('GET', '/api', { reportProgress: true });`, errors: [error] },
  ],
});
