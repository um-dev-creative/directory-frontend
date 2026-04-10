# Hook: Pre-Edit — Checks Before Editing a File

This hook defines the checks Claude must perform **before modifying any file** in this project.

---

## Mandatory checks

### 1. Protected file — immediate stop

If the target file belongs to any of these paths, **stop the edit and notify the user**:

```
ssl/
dist/
Dockerfile
docker-entrypoint.sh
server/config/app.config.js
```

Stop message:
> "⛔ Cannot modify `<file>` — it is on the project's protected files list. If you need changes in this area, make them manually."

---

### 2. Read the file before editing

**Always** use the `Read` tool to read the full content of the file before proposing any change. Never edit blindly.

---

### 3. No dead code — unused imports, variables, and functions

**Before writing any code**, verify that you are not introducing:
- Unused imports (`import { Foo } from '...'` if `Foo` does not appear in the file)
- Variables declared but never read (`const x = ...` that is never used)
- Function parameters not referenced in the body
- Private functions or methods that are never called

If you detect dead code in the **existing** file, do not propagate or copy it in your edit. Mention it to the user.

> Reason: `tsconfig.json` has `noUnusedLocals` enabled — the compiler will reject the build if there are unused imports or local variables.

---

### 4. Verify conventions by file type

#### Angular component (`*.component.ts`)

Check that the file **already has** or that the changes **maintain**:
- `standalone: true` in the `@Component` decorator
- No references to NgModule
- Use of `inject()` for dependencies (not constructor DI, except for inheritance or ControlValueAccessor)

If you detect an existing violation, **do not propagate it** in your edit and mention the finding.

#### Angular template (`*.component.html`)

Verify the target template uses (or will continue to use after the change):
- `@if` / `@for` / `@let` — **not** `*ngIf` / `*ngFor` / `*ngSwitch`
- If the i18n key already exists → use `{{ 'key' | translate }}`
- If the text is new or prototypal → hardcoded string is acceptable, add `<!-- TODO: i18n -->`
- No hardcoded URLs in `href`, `src`, or absolute external `[routerLink]`

#### NgRx effect (`*.effects.ts`)

Verify:
- There is a `catchError` that dispatches the `*Failure` action
- No direct HTTP calls to the Java backend (bypassing the BFF)
- HTTP only via `HttpService` — never `HttpClient` directly

#### BFF file (`server/**/*.js`)

Verify:
- The file has `'use strict';` at the top
- No credentials, secrets, or hardcoded URLs are introduced
- Backend URLs are read from `process.env.*` or the central config
- Any controller that builds proxy URLs includes SSRF validation (domain allowlist)
- No sensitive information is exposed in error responses
- Session managed with `getUserSession()` from `redis-session-store.js` — not `req.session?.token`

#### Environment file (`src/environments/*.ts`)

- Confirm it only contains `environment.*` — no real credentials
- Verify no direct Java backend URLs are added (those go in the BFF)

---

### 5. SSR check

If the modified file uses any of these APIs:
- `window`, `document`, `navigator`, `location`
- `localStorage`, `sessionStorage`, `indexedDB`
- `setTimeout`, `setInterval` (without cleanup in `ngOnDestroy`)

Verify they are wrapped with `isPlatformBrowser()` or use `StorageMockService`. If they are not, warn before proceeding.

---

### 6. Test impact

If the modified file has a corresponding `*.spec.ts`:
- Mention that tests may need updating.
- If the change affects the public interface (inputs, outputs, public methods, NgRx actions), indicate which specs should be reviewed.

---

## Pre-edit flow summary

```
1. Is it a protected file?
   → YES: Stop and notify
   → NO: Continue

2. Read the full file

3. Does the code I am about to write have unused imports, variables, or functions?
   → Remove them before editing

4. Is it an Angular component?
   → Verify standalone, inject(), no NgModule

5. Is it a template?
   → Verify @if/@for/@let, | translate, no hardcoded strings

6. Is it a BFF file?
   → Verify 'use strict', SSRF validation, no hardcoded secrets

7. Does it use browser-only APIs?
   → Verify SSR protection

8. Does it have a corresponding spec?
   → Warn about possible test updates

9. Proceed with the edit
```
