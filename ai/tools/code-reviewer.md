# Tool: Code Reviewer

## Purpose

Multi-layer code review tool used by all agents before marking a task complete.

## Usage

Invoke via Copilot Chat: `#review-code`

Or manually run through each layer checklist below.

## Layer 1 — Angular Review

```bash
# Compile check
ng build --configuration development 2>&1 | grep -E "error|warning"

# Test check
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox 2>&1 | tail -20
```

**Manual checks:**
```
[ ] standalone: true
[ ] inject() — no constructor injection
[ ] @if / @for / @let — no structural directives
[ ] All imports in imports: []
[ ] Path aliases — no ../../../../
[ ] isPlatformBrowser() guards
[ ] | translate for visible text
[ ] No hardcoded BFF URLs
[ ] No raw HttpClient
```

## Layer 2 — NgRx Review

```
[ ] Actions: [Feature] Verb Noun
[ ] 6 store files all present
[ ] Effects use HttpService only
[ ] Effects have catchError
[ ] Selectors use createFeatureSelector
[ ] StoreService facade for component access
[ ] Store registered in app.config.ts
```

## Layer 3 — BFF Review

```bash
# Node syntax check
node -e "require('./server/controller/{resource}.controller')"
node -e "require('./server/routes/{resource}.routes')"
```

**Manual checks:**
```
[ ] 'use strict' at top
[ ] URL domain validation before fetch
[ ] OAuth from oauth-client / backbone-client
[ ] No VAULT_TOKEN / ENCRYPT_KEY in code
[ ] try/catch on all async handlers
[ ] DEBUG_MODE check before console logs
[ ] app.config.js NOT modified
```

## Security Scan

```
[ ] grep -r "VAULT_TOKEN" server/controller/     → should be empty
[ ] grep -r "ENCRYPT_KEY" server/controller/     → should be empty
[ ] grep -r "ENCRYPT_IV" server/controller/      → should be empty
[ ] grep -r "HttpClient" src/app/features/       → should be empty
[ ] grep -r "\*ngIf\|\*ngFor" src/app/           → should be empty
```

## Pre-PR Security Audit

```bash
npm audit --audit-level=high
```

Must pass with zero `high` or `critical` vulnerabilities before merge.

