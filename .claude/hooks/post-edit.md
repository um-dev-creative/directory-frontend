# Hook: Post-Edit — Checks After Editing a File

This hook defines the checks Claude must perform **after modifying any file** in this project.

---

## Mandatory checks after each edit

### 1. Syntax and consistency validation

#### Angular components (`*.component.ts`)

Confirm the edited file:
- [ ] Has `standalone: true`
- [ ] The `imports: []` array includes everything used in the template (TranslateModule, etc.)
- [ ] No `CommonModule` unless `NgClass`, `AsyncPipe`, or another directive from that module is used
- [ ] No NgModule imports from the project
- [ ] Injected dependencies use `inject()` in the class body
- [ ] No secrets, OAuth tokens, or AES keys in the component code

#### Templates (`*.component.html`)

Confirm:
- [ ] No `*ngIf`, `*ngFor`, `*ngSwitch` directives present
- [ ] If the i18n key already exists → use `{{ 'translation.key' | translate }}`
- [ ] If the text is new or prototypal → hardcoded string is acceptable, add `<!-- TODO: i18n -->`
- [ ] No hardcoded URLs in `href`, `src`, or router bindings

#### NgRx

- [ ] Actions follow format `[Feature] Verb noun`
- [ ] Reducer is a pure function (no service calls, no side effects)
- [ ] Selectors derive from `createFeatureSelector` or other selectors
- [ ] Effects handle errors with `catchError` → `*Failure` action
- [ ] Effects use `HttpService` — never `HttpClient` directly
- [ ] Facade exposes `toSignal()` for Angular 20 template consumption

#### BFF (`server/**/*.js`)

- [ ] `'use strict';` present at the top of the file
- [ ] SSRF validation present in each method that builds proxy URLs
- [ ] No hardcoded credentials, tokens, or secrets
- [ ] Error responses do not expose stack traces or internal data to the client
- [ ] Environment variables accessed with `process.env.*`
- [ ] Session managed with `getUserSession()` — not `req.session?.token`
- [ ] No `console.log` with tokens, passwords, ENCRYPT_KEY, or VAULT_TOKEN

---

### 2. Verify imports and exports

If a new file was created:
- Should it be exported from the folder's `index.ts`? If the folder has a barrel file, add it.
- Should it be registered in `app.config.ts`? (reducers, effects, providers)
- If it is a new BFF route, is it registered in `server.js`?
- If it is a new BFF rewrite, is it added in `server/config/config.json`?

If a file was deleted or renamed:
- Verify there are no broken imports in the rest of the code.
- Use Grep to search for references before confirming.

---

### 3. Test reminder

After each significant edit, indicate:

```
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox
```

If the change affected:
- **Business logic** → unit tests for the file must be updated.
- **Public interface of a component** (new inputs/outputs) → the spec needs new cases.
- **NgRx actions or reducers** → reducer and selector specs must be reviewed.
- **BFF routes** → if integration tests exist, run them.

---

### 4. Translation keys

If the edited template introduces new text or modifies existing labels:

Remember to add translation keys in:
```
src/assets/i18n/es.json    ← Spanish (primary)
src/assets/i18n/en.json    ← English (if applicable)
```

Recommended key format: `feature.component.element`

```json
{
  "partner": {
    "offers": {
      "title": "My offers",
      "no-results": "No offers available"
    }
  }
}
```

---

### 5. SSR compatibility — final review

If the edited file introduces code that accesses browser APIs, confirm:

```typescript
// ✅ Correct
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

private readonly platformId = inject(PLATFORM_ID);

if (isPlatformBrowser(this.platformId)) {
  // Browser-only code here
}

// ✅ Alternative for storage
private readonly storage = inject(StorageMockService);
```

If you found unsafe access to browser APIs, **report it** even after completing the edit.

---

### 6. Relevant change log

If the change is architectural (new store, new interceptor, new lazy route, new npm dependency, new BFF route), briefly mention:
- What was added and why
- Which parts of the system it affects
- Whether it requires changes in `app.config.ts`, `app.routes.ts`, `server.js`, or other configuration files

---

## Post-edit flow summary

```
1. Confirm the edited file meets the conventions for its type
   → Angular: standalone, inject(), no *ngIf/*ngFor
   → NgRx: actions, pure reducers, effects with catchError, facades with toSignal()
   → BFF: 'use strict', SSRF validation, no secrets

2. Verify imports/exports
   → Needs barrel update?
   → Needs registration in app.config.ts?
   → Needs registration in server.js or config.json?

3. Was visible text added?
   → Remember to add keys in i18n/

4. Were browser-only APIs used?
   → Verify SSR protection

5. Indicate the test command to run

6. Inform the user of the result and next steps
```
