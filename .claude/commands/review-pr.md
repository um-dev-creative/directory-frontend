# /review-pr — Review Pull Request

Reviews a PR following the conventions and rules of the Directory Frontend project.

## Usage

```
/review-pr <pr-number>
/review-pr <pr-number> --focus <area>
```

**Examples:**
- `/review-pr 72`
- `/review-pr 72 --focus ngrx`
- `/review-pr 72 --focus security`
- `/review-pr 72 --focus bff`

---

## Review process

Execute the following steps in order:

### 1. Fetch the PR changes

```bash
gh pr view <number> --json title,body,files,additions,deletions,baseRefName,headRefName
gh pr diff <number>
```

Verify that the PR targets the `development` branch (not `main`).

---

### 2. Mandatory review checklist

For each modified file, verify:

#### Angular — Components (`src/**/*.component.ts`)
- [ ] `standalone: true` on all new or modified components
- [ ] No `NgModule` — do not import or declare in modules
- [ ] Injection with `inject()`, not constructor (except ControlValueAccessor or required inheritance)
- [ ] Templates use `@if` / `@for` / `@let` — not `*ngIf` / `*ngFor` / `*ngSwitch`
- [ ] No `CommonModule` unless `NgClass`, `AsyncPipe`, or another specific directive from it is used
- [ ] Visible text with `{{ 'key' | translate }}` — new keys added to i18n

#### State — NgRx / Signals (`src/**/*.actions.ts`, `*.reducer.ts`, `*.effects.ts`, `*.selectors.ts`)
- [ ] Global state managed with NgRx (store/actions/reducer/effects/selectors)
- [ ] Signals used **only** for local component state
- [ ] Actions in format `[Feature] Verb noun`
- [ ] Reducers are pure functions (no side effects, no service calls)
- [ ] Effects handle errors and dispatch `*Failure` action with `catchError`
- [ ] Effects use `switchMap`/`concatMap`/`mergeMap` according to the operation's semantics
- [ ] Components consume the store via **facade** (`StoreService`) — never `Store` directly
- [ ] Facades expose Signals with `toSignal()` for consumption in modern templates

#### HTTP and BFF
- [ ] No direct HTTP calls to the Java backend — everything goes through `/drb/api/v1/*` or `/bkd/api/v1/*`
- [ ] Uses `HttpService` (not `HttpClient` directly)
- [ ] URLs built with `DFC` constants or `environment`, never hardcoded

#### BFF — Express.js (`server/**/*.js`)
- [ ] `'use strict';` at the top of every new file
- [ ] SSRF validation present in every controller that builds proxy URLs
- [ ] Domain allowlist applied: `directory-backend`, `backbone-rest`, `localhost`, `prx-qa.*`
- [ ] No hardcoded credentials, secrets, or URLs — everything from `process.env.*`
- [ ] Session read with `getUserSession()` from `redis-session-store.js` — **not** `req.session?.token`
- [ ] Passwords encrypted with `CryptoJS.AES.encrypt` before forwarding to backend
- [ ] Error responses do not expose stack traces or internal data to the client
- [ ] No logging of `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV`, full tokens, or passwords

#### SSR — Server-Side Rendering (`src/**/*.ts`)
- [ ] No direct access to `window`, `document`, `localStorage`, or `sessionStorage`
- [ ] Use of `isPlatformBrowser()` or `StorageMockService` where applicable
- [ ] No timers or intervals without cleanup (SSR memory leaks)

#### Security — Cross-cutting review
- [ ] No credentials, OAuth tokens, or AES keys (`ENCRYPT_KEY`, `ENCRYPT_IV`) in Angular code
- [ ] No `console.log` with sensitive user data (tokens, passwords)
- [ ] User inputs sanitized before rendering as HTML
- [ ] No bypassing of authentication guards (`authGuard`, `roleGuard`)
- [ ] `npm audit` reports no new `critical` or `high` vulnerabilities
- [ ] `request` package not introduced as a direct dependency

#### Code quality
- [ ] TypeScript strict — no `any` unless explicitly justified in a comment
- [ ] No dead or commented-out code (unused imports, unreferenced variables)
- [ ] Imports organized: Angular > third-party > own (using aliases `@app`, `@core`, `@shared`)
- [ ] Test files updated to cover the changes
- [ ] No unused private functions or methods (fails with `noUnusedLocals`)

#### Protected files
- [ ] Not touched: `ssl/`, `dist/`, `Dockerfile`, `docker-entrypoint.sh`, `server/config/app.config.js`

---

### 3. Additional checks by area

#### If the PR touches the BFF (`server/`)
- Verify controllers do not unnecessarily expose Java backend data.
- Confirm new routes are registered in `server.js`.
- Confirm new rewrites are in `server/config/config.json`.
- Verify session tokens are correctly validated before proxying.

#### If the PR adds dependencies (`package.json`)
- Run `npm audit --audit-level=high` and report the result.
- Verify the package has recent releases (< 12 months).
- The `request` package is **PROHIBITED** — use native `fetch` or `axios`.

#### If the PR modifies the NgRx store (`session` or others)
- Confirm `app.config.ts` is updated (reducer + effects).
- Confirm the facade exposes the necessary selectors.
- Confirm reducer and selector specs exist and pass.

#### If the PR adds navigation routes (`app.routes.ts`)
- Confirm protected routes have the appropriate guard (`authGuard`, `roleGuard`).
- Confirm auth routes have `noAuthGuard`.

---

### 4. Review report format

Deliver the result with this structure:

```markdown
## PR Review #<number>: <title>

**Base:** `<source-branch>` → `<target-branch>`
**Modified files:** <N> | **+<additions>** / **-<deletions>**

### Summary
<Brief description of what the PR does and its impact on the system>

### ✅ Positive points
- <Good practices detected>

### ⚠️ Observations (non-blocking)
- **<file>:<line>** — <description of the issue and suggestion>

### 🚫 Blocking issues
- **<file>:<line>** — <description of the issue>
  ```
  // Problematic code
  ```
  **Suggested fix:**
  ```
  // Corrected code
  ```

### 📋 Final checklist
- [ ] Standalone components
- [ ] No *ngIf/*ngFor
- [ ] Complete translations
- [ ] No hardcoded URLs
- [ ] SSR compatible
- [ ] BFF: 'use strict' + SSRF validation
- [ ] Tests updated
- [ ] Protected files intact
- [ ] Target branch: development

### Verdict
🟢 APPROVED / 🟡 APPROVED WITH OBSERVATIONS / 🔴 CHANGES REQUIRED
```
