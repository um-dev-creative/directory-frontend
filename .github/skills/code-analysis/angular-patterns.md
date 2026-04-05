# Skill: Angular Code Analysis

## Purpose

Analyze Angular 20 code in the Directory Frontend project for convention compliance, SSR safety, and architectural correctness.

## When to Use

- Reviewing Angular components, services, guards, or interceptors
- Validating generated code before committing
- Auditing existing code for convention drift

## Analysis Dimensions

### 1. Component Structure Analysis

Check for:
- `standalone: true` presence (NgModule is **forbidden**)
- `inject()` usage (no constructor injection)
- `@if` / `@for` / `@let` (no structural directives)
- All template dependencies in `imports: []`
- Path aliases (`@core/`, `@shared/`, `@app/`, `@env/`)

**Detection Patterns:**

```typescript
// ❌ Flag this — NgModule:
@NgModule({ declarations: [MyComponent] })

// ❌ Flag this — constructor injection:
constructor(private service: SomeService) {}

// ✅ Correct — inject():
private readonly service = inject(SomeService);

// ❌ Flag this — missing standalone:
@Component({ selector: 'app-my' })

// ✅ Correct:
@Component({ selector: 'app-my', standalone: true })
```

### 2. HTTP Call Analysis

Check that:
- Only `HttpService` is used — never raw `HttpClient`
- URLs built from `DFC.RelativePath.*` or `environment.*`
- No direct calls to Java backend URLs

**Detection Patterns:**

```typescript
// ❌ Flag — raw HttpClient:
private readonly http = inject(HttpClient);
this.http.get('https://api.java-backend.com/...');

// ❌ Flag — hardcoded URL:
this.http.get('/drb/api/v1/partners');

// ✅ Correct:
private readonly http = inject(HttpService);
this.http.get(DFC.RelativePath.PARTNERS_PATH);
```

### 3. SSR Safety Analysis

Scan for unguarded browser API usage:

```typescript
// ❌ Flag these patterns (unguarded browser APIs):
window.addEventListener(...)
window.scrollTo(...)
localStorage.getItem(...)
sessionStorage.setItem(...)
document.getElementById(...)
document.querySelector(...)
navigator.userAgent

// ✅ Acceptable — guarded with isPlatformBrowser():
if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
  window.scrollTo(0, 0);
}

// ✅ Acceptable — StorageMockService:
private readonly storage = inject(StorageMockService);
this.storage.getLocal('key');
this.storage.setLocal('key', value);
```

### 4. Template Control Flow Analysis

```html
<!-- ❌ Flag these — legacy structural directives: -->
<div *ngIf="condition">
<li *ngFor="let item of items">
<div [ngSwitch]="value">
  <div *ngSwitchCase="'a'">

<!-- ✅ Correct — modern control flow: -->
@if (condition) { ... }
@for (item of items; track item.id) { ... }
@switch (value) { @case ('a') { ... } }
@let valor = signal$ | async;
```

### 5. i18n Analysis

```html
<!-- ❌ Flag — hardcoded visible text without TODO: -->
<p>Welcome to LatinHub</p>
<button>Submit</button>

<!-- ✅ Acceptable — translate pipe: -->
<p>{{ 'welcome.title' | translate }}</p>

<!-- ✅ Acceptable — with TODO comment: -->
<p>Welcome to LatinHub</p>  <!-- TODO: i18n -->
```

### 6. Import Path Analysis

```typescript
// ❌ Flag — deep relative paths (more than 2 levels):
import { MyService } from '../../../core/services/my.service';
import { MyModel } from '../../../../shared/models/my.model';

// ✅ Correct — path aliases:
import { MyService } from '@core/services/my.service';
import { MyModel } from '@shared/models/my.model';
import { DFC } from '@shared/constants/app.const';
import { environment } from '@env/environment';
```

### 7. Signal-Based Input/Output Analysis

```typescript
// ❌ Flag — decorator-based inputs (Angular 20 prefers signals):
@Input() name: string = '';
@Output() clicked = new EventEmitter<void>();

// ✅ Correct — signal-based:
readonly name = input<string>('');
readonly clicked = output<void>();
```

## Output Format

```
ANGULAR ANALYSIS for {file}

✅ PASS: standalone: true present
✅ PASS: inject() used for all dependencies
✅ PASS: Modern control flow (@if/@for) used
⚠️ WARNING: Hardcoded text "Submit" on line 42 — add | translate or // TODO: i18n
⚠️ WARNING: @Input() decorator on line 15 — prefer signal-based input()
❌ VIOLATION: *ngFor used on line 67 — replace with @for
❌ VIOLATION: Raw HttpClient on line 23 — must use HttpService
🔒 SECURITY: localStorage accessed without isPlatformBrowser() on line 89
🔒 SECURITY: Deep relative import on line 5 — use path alias
```

