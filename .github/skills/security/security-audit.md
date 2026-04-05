# Skill: Security Audit

## Purpose

Perform comprehensive security audits across all layers of the Directory Frontend project: Angular, NgRx, and BFF.

## When to Use

- Reviewing code changes before merge
- Auditing for secret exposure
- Validating BFF endpoint security
- Checking protected file integrity
- Pre-PR security validation

## Security Scan Commands

### Secret Exposure Detection

```bash
# Check for VAULT_TOKEN in all source files
grep -rn "VAULT_TOKEN" server/controller/ src/app/ --include="*.ts" --include="*.js"
# Expected: EMPTY (no results)

# Check for encryption keys
grep -rn "ENCRYPT_KEY" server/controller/ src/app/ --include="*.ts" --include="*.js"
grep -rn "ENCRYPT_IV" server/controller/ src/app/ --include="*.ts" --include="*.js"
# Expected: EMPTY

# Check for OAuth client secrets in Angular code
grep -rn "CLIENT_SECRET\|client_secret" src/app/ --include="*.ts"
# Expected: EMPTY

# Check for hardcoded tokens
grep -rn "eyJhbGci\|Bearer [A-Za-z0-9]" server/controller/ src/app/ --include="*.ts" --include="*.js"
# Expected: EMPTY (except template patterns)
```

### Protected Files Integrity

```bash
# These files must NEVER be in a diff/changeset:
# - ssl/*
# - dist/*
# - Dockerfile
# - docker-entrypoint.sh
# - server/config/app.config.js

# Check with git:
git diff --name-only HEAD | grep -E "^(ssl/|dist/|Dockerfile|docker-entrypoint.sh|server/config/app.config.js)$"
# Expected: EMPTY
```

### Forbidden Package Detection

```bash
# The 'request' package is PROHIBITED
grep -rn "require('request')" server/ --include="*.js"
grep -rn "require('request-promise')" server/ --include="*.js"
# Expected: EMPTY (except transitive deps in node_modules)
```

### Angular-Specific Security

```bash
# No raw HttpClient usage
grep -rn "HttpClient" src/app/features/ src/app/core/services/ --include="*.ts" | grep -v "HttpClientTestingModule" | grep -v ".spec.ts"
# Expected: Only HttpService wrapper should import HttpClient

# No direct Java backend URLs
grep -rn "directory-backend\|backbone-rest\|prx-qa" src/app/ --include="*.ts"
# Expected: EMPTY (these should only be in BFF)

# No legacy structural directives
grep -rn "\*ngIf\|\*ngFor\|\*ngSwitch" src/app/ --include="*.html"
# Expected: EMPTY
```

### BFF-Specific Security

```bash
# All controllers have 'use strict'
for f in server/controller/*.js; do
  head -1 "$f" | grep -q "'use strict'" || echo "❌ Missing 'use strict' in $f"
done

# All controllers have URL validation
for f in server/controller/*.js; do
  grep -q "isValidUrl" "$f" || echo "⚠️ Missing isValidUrl in $f"
done

# No token logging
grep -rn "console.log.*[Tt]oken\|console.log.*[Bb]earer\|console.log.*session" server/controller/ --include="*.js"
# Expected: EMPTY
```

### Dependency Audit

```bash
# Required before any PR that touches dependencies
npm audit --audit-level=high

# Expected: 0 high or critical vulnerabilities
# Known exceptions documented in CLAUDE.md "Riesgos aceptados temporalmente"
```

## Security Checklist

### Angular Layer
```
[ ] No VAULT_TOKEN / ENCRYPT_KEY / ENCRYPT_IV in any Angular file
[ ] No OAuth client secrets in Angular code
[ ] No internal Java service URLs in Angular
[ ] HttpService used exclusively (no raw HttpClient)
[ ] DFC.RelativePath.* used for all BFF URLs
[ ] isPlatformBrowser() guards on all browser APIs
[ ] StorageMockService used instead of direct localStorage/sessionStorage
[ ] No sensitive data in console.log statements
```

### NgRx Layer
```
[ ] No secrets stored in NgRx state
[ ] Effects use BFF paths only (/drb/*, /bkd/*) — never direct Java URLs
[ ] No token values dispatched as action props
```

### BFF Layer
```
[ ] 'use strict' in all JS files
[ ] isValidUrl() called before every fetch()
[ ] OAuth from oauth-client.js or backbone-client.js
[ ] try/catch on all async handlers
[ ] DEBUG_MODE check before console.error
[ ] No internal URLs in HTTP responses
[ ] No token values in HTTP responses
[ ] app.config.js NOT modified
```

### Infrastructure
```
[ ] ssl/ directory untouched
[ ] dist/ directory untouched
[ ] Dockerfile untouched
[ ] docker-entrypoint.sh untouched
[ ] npm audit --audit-level=high passes
```

## Output Format

```
SECURITY AUDIT RESULT

✅ PASS: No secrets exposed in Angular code
✅ PASS: No secrets exposed in BFF controllers
✅ PASS: Protected files untouched
✅ PASS: All BFF controllers have URL validation
✅ PASS: npm audit passes
⚠️ WARNING: console.log on line 34 of {file} — verify no sensitive data
❌ VIOLATION: Raw HttpClient in {file}:23
🔒 CRITICAL: VAULT_TOKEN referenced in {file}:12 — BLOCKS MERGE
🔒 CRITICAL: app.config.js modified — BLOCKS MERGE
```

