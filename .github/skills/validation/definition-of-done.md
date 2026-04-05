# Skill: Definition of Done Validation

## Purpose

Validate that a delivered feature meets all criteria in the project's Definition of Done before marking it as complete.

## When to Use

- Before marking a story/task as Done
- During PR review
- As a final validation step after all agents have completed their work

## Definition of Done Checklist

A story is **DONE** only when ALL items are checked:

### Code Quality — Angular
- [ ] All components are `standalone: true`
- [ ] `inject()` used — no constructor injection
- [ ] `@if` / `@for` / `@let` — no `*ngIf` / `*ngFor`
- [ ] `HttpService` only — no raw `HttpClient`
- [ ] Path aliases used — no `../../../` deep relative paths
- [ ] All browser APIs guarded with `isPlatformBrowser()`
- [ ] `StorageMockService` for storage — no direct localStorage/sessionStorage
- [ ] `| translate` for visible text (or `// TODO: i18n` comment)
- [ ] Tailwind CSS with `tw-` prefix for styling
- [ ] All template deps in `imports: []`

### Code Quality — NgRx
- [ ] Feature store has all 6 files (state, actions, reducer, effects, selectors, StoreService)
- [ ] Actions follow `[Feature] Verb Noun` naming
- [ ] Effects have `catchError` for every HTTP call
- [ ] `switchMap` for reads, `concatMap`/`mergeMap` for writes
- [ ] Components use `StoreService` facade — never `store.dispatch()` directly
- [ ] Store registered in `app.config.ts`

### Code Quality — BFF
- [ ] `'use strict'` in all new JS files
- [ ] URL domain validation (`isValidUrl()`) in every new controller
- [ ] OAuth from `oauth-client.js` / `backbone-client.js`
- [ ] `try/catch` on all async handlers
- [ ] `DEBUG_MODE` check before `console.error`
- [ ] `app.config.js` NOT modified

### Testing
- [ ] Spec files co-located with source files
- [ ] `ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox` passes
- [ ] Coverage meets thresholds in `karma.conf.js`
- [ ] All dependencies mocked (no real HTTP calls in tests)
- [ ] BFF controller syntax validation passes

### Security
- [ ] No `VAULT_TOKEN` / `ENCRYPT_KEY` / `ENCRYPT_IV` in any file
- [ ] No OAuth client secrets in Angular code
- [ ] No internal Java service URLs in Angular code
- [ ] `npm audit --audit-level=high` passes
- [ ] Protected files untouched: `ssl/`, `dist/`, `Dockerfile`, `app.config.js`
- [ ] No `request` package usage (PROHIBITED)

### Build
- [ ] `ng build --configuration development` passes with zero errors

### Documentation
- [ ] Component documentation generated (if applicable)
- [ ] API endpoint documented (if applicable)
- [ ] Store documentation generated (if applicable)

## DoD Validation Commands

```bash
# Run all validation steps:
echo "=== Build Check ===" && \
ng build --configuration development && \
echo "=== Test Check ===" && \
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox && \
echo "=== Security Audit ===" && \
npm audit --audit-level=high && \
echo "=== BFF Syntax Check ===" && \
for f in server/controller/*.js; do node -e "require('./$f')" 2>/dev/null && echo "✅ $f" || echo "❌ $f"; done && \
echo "=== Secret Scan ===" && \
grep -rn "VAULT_TOKEN\|ENCRYPT_KEY\|ENCRYPT_IV" server/controller/ src/app/ --include="*.ts" --include="*.js" && echo "🔒 SECRETS FOUND — BLOCK" || echo "✅ No secrets" && \
echo "=== Protected Files ===" && \
git diff --name-only HEAD 2>/dev/null | grep -E "^(ssl/|dist/|Dockerfile|docker-entrypoint.sh|server/config/app.config.js)$" && echo "🔒 PROTECTED FILE MODIFIED — BLOCK" || echo "✅ Protected files safe" && \
echo "=== DoD Complete ==="
```

## Output Format

```
DOD VALIDATION RESULT

✅ Build: ng build passes
✅ Tests: ng test passes (coverage: 85%)
✅ Security: npm audit passes
✅ BFF: All controllers load
✅ Secrets: None found
✅ Protected: No protected files modified

VERDICT: ✅ DONE — Ready for merge
```

or

```
DOD VALIDATION RESULT

✅ Build: ng build passes
❌ Tests: 2 specs failing
✅ Security: npm audit passes
⚠️ BFF: Missing isValidUrl in new-resource.controller.js
✅ Secrets: None found
✅ Protected: No protected files modified

VERDICT: ❌ NOT DONE — Fix test failures and add URL validation
```

