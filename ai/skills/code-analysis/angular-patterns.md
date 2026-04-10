# Skill: Angular Code Analysis

## Purpose

Analyze Angular 20 code in the Directory Frontend project for convention compliance, SSR safety, and architectural correctness.

## Analysis Dimensions

### 1. Component Structure Analysis

Check for:
- `standalone: true` presence
- `inject()` usage (no constructor injection)
- `@if` / `@for` / `@let` (no structural directives)
- All template dependencies in `imports: []`
- Path aliases (`@core/`, `@shared/`, `@app/`, `@env/`)

**Detection Pattern:**
```typescript
// ❌ Flag this pattern:
constructor(private service: SomeService) {}

// ✅ Correct pattern:
private readonly service = inject(SomeService);
```

### 2. HTTP Call Analysis

Check that:
- Only `HttpService` is used — never raw `HttpClient`
- URLs built from `DFC.RelativePath.*` or `environment.*`
- No direct calls to Java backend URLs

**Detection Pattern:**
```typescript
// ❌ Flag — raw HttpClient:
private readonly http = inject(HttpClient);
this.http.get('https://api.java-backend.com/...');

// ✅ Correct:
private readonly http = inject(HttpService);
this.http.get(DFC.RelativePath.SOME_PATH);
```

### 3. SSR Safety Analysis

Scan for unguarded browser API usage:

```typescript
// ❌ Flag these patterns:
window.addEventListener(...)
localStorage.getItem(...)
document.getElementById(...)
sessionStorage.setItem(...)

// ✅ Acceptable patterns:
if (isPlatformBrowser(this.platformId)) { window... }
this.storage.getLocal('key')  // StorageMockService
```

### 4. Template Control Flow Analysis

```html
<!-- ❌ Flag these: -->
<div *ngIf="condition">
<li *ngFor="let item of items">
<div [ngSwitch]="value">

<!-- ✅ Correct: -->
@if (condition) { ... }
@for (item of items; track item.id) { ... }
@switch (value) { @case ('a') { ... } }
```

### 5. i18n Analysis

```html
<!-- ❌ Flag hardcoded visible text without TODO: -->
<p>Welcome to LatinHub</p>

<!-- ✅ Acceptable: -->
<p>{{ 'welcome.title' | translate }}</p>
<!-- or with comment: -->
<p>Welcome to LatinHub</p>  <!-- TODO: i18n -->
```

## Output Format

```
ANALYSIS RESULT for {file}

✅ PASS: standalone: true present
✅ PASS: inject() used for all dependencies
⚠️ WARNING: Hardcoded text "Submit" on line 42 — add | translate or // TODO: i18n
❌ VIOLATION: *ngFor used on line 67 — replace with @for
🔒 SECURITY: localStorage accessed without isPlatformBrowser() on line 89
```

