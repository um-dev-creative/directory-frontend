# Skill: Code Review

## Purpose

Multi-layer code review across Angular, NgRx, and BFF for convention compliance, security violations, and architectural correctness.

## When to Use

- Reviewing code changes before merge
- Auditing generated code for convention compliance
- Post-implementation review by the Reviewer agent

## Review Severity Levels

```
✅ PASS     — Convention followed correctly
⚠️ WARNING  — Minor issue, should fix (not a blocker)
❌ VIOLATION — Must fix before merge
🔒 SECURITY  — Critical security issue, blocks merge immediately
```

For each finding: **file + line**, **description**, **corrected code snippet**.

## Layer 1 — Angular Review

### Compilation Check
```bash
ng build --configuration development 2>&1 | grep -E "error|warning"
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox 2>&1 | tail -20
```

### Manual Checks
```
[ ] standalone: true — NgModule is forbidden
[ ] inject() for all deps — no constructor injection
[ ] @if / @for / @let — no *ngIf / *ngFor / *ngSwitch
[ ] All template deps in imports: []
[ ] | translate for visible text (or // TODO: i18n)
[ ] isPlatformBrowser() guards + // SSR: browser-only on browser APIs
[ ] StorageMockService — no direct localStorage/sessionStorage
[ ] Path aliases — no ../../../../ deep relative paths
[ ] DFC.RelativePath.* — no hardcoded BFF URLs
[ ] HttpService only — no raw HttpClient
[ ] Brand colors: tw-bg-emerald-green-*, tw-bg-coral-*, tw-bg-sky-blue-*
[ ] Signal-based inputs (input()) preferred over @Input() decorators
```

## Layer 2 — NgRx Review

```
[ ] Actions: [Feature] Verb Noun naming
[ ] All 6 store files present for every feature
[ ] Effects: HttpService only, never raw HttpClient
[ ] Effects: catchError → dispatch failure action (no missing error handling)
[ ] Effects: switchMap for reads, concatMap/mergeMap for writes
[ ] Selectors: createFeatureSelector + createSelector
[ ] Components use StoreService facade — never store.dispatch() directly
[ ] Store registered in app.config.ts
[ ] State interface has loading/saving/error properties
```

## Layer 3 — BFF Review

### Syntax Check
```bash
node -e "require('./server/controller/{resource}.controller')"
node -e "require('./server/routes/{resource}.routes')"
```

### Manual Checks
```
[ ] 'use strict' at top of every JS file
[ ] isValidUrl() called before every fetch()
[ ] OAuth token from oauth-client.js or backbone-client.js — never hardcoded
[ ] try/catch on all async handlers
[ ] DEBUG_MODE check before console.error
[ ] app.config.js NOT modified
[ ] No 'request' package usage (PROHIBITED — use native fetch)
[ ] No internal URLs exposed in responses
[ ] Response format: res.status(code).json(data)
```

## Security Review

```
[ ] No VAULT_TOKEN anywhere in code
[ ] No ENCRYPT_KEY / ENCRYPT_IV hardcoded
[ ] No OAuth client secrets in Angular code
[ ] No internal Java service URLs in Angular
[ ] No sensitive data (passwords, tokens) in logs
[ ] No token values in HTTP responses
[ ] Protected files untouched (ssl/, dist/, Dockerfile, app.config.js)
[ ] npm audit --audit-level=high passes
```

### Security Scan Commands
```bash
grep -rn "VAULT_TOKEN" server/controller/ src/app/ --include="*.ts" --include="*.js"
grep -rn "ENCRYPT_KEY\|ENCRYPT_IV" server/controller/ src/app/ --include="*.ts" --include="*.js"
grep -rn "HttpClient" src/app/features/ --include="*.ts" | grep -v ".spec.ts"
grep -rn "\*ngIf\|\*ngFor" src/app/ --include="*.html"
grep -rn "require('request')" server/ --include="*.js"
```

## Output Format

```
CODE REVIEW for {PR/changeset description}

=== Angular Layer ===
✅ PASS: standalone: true in all components
✅ PASS: inject() used everywhere
⚠️ WARNING: Hardcoded text "Submit" in partner-form.component.html:42
❌ VIOLATION: *ngFor in deals-list.component.html:67 — replace with @for

=== NgRx Layer ===
✅ PASS: Actions follow naming convention
✅ PASS: All 6 store files present
⚠️ WARNING: switchMap used for POST in deals-effects.ts:45

=== BFF Layer ===
✅ PASS: 'use strict' present
✅ PASS: URL validation before fetch
❌ VIOLATION: Missing try/catch in new handler

=== Security ===
✅ PASS: No secrets exposed
✅ PASS: Protected files untouched

VERDICT: ⚠️ 2 violations, 2 warnings — fix violations before merge
```

