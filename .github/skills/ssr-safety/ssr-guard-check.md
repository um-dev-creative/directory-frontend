# Skill: SSR Safety Check

## Purpose

Audit Angular components and services for Server-Side Rendering (SSR) compatibility, detecting unguarded browser API usage that would break during SSR.

## When to Use

- Reviewing new or modified Angular components
- Auditing existing code for SSR violations
- Validating that generated components are SSR-safe

## Browser APIs That Break SSR

The following APIs are **NOT available** during server-side rendering and will throw errors if accessed without guards:

### Window Object
```typescript
// ❌ These will break SSR:
window.addEventListener(...)
window.removeEventListener(...)
window.scrollTo(...)
window.innerWidth
window.innerHeight
window.location.href
window.history.pushState(...)
window.open(...)
window.matchMedia(...)
window.requestAnimationFrame(...)
window.setTimeout(...)  // technically works but should be guarded
window.setInterval(...)
```

### Document Object
```typescript
// ❌ These will break SSR:
document.getElementById(...)
document.querySelector(...)
document.querySelectorAll(...)
document.createElement(...)
document.body.classList.add(...)
document.title = '...'
document.cookie
document.addEventListener(...)
```

### Storage
```typescript
// ❌ These will break SSR:
localStorage.getItem(...)
localStorage.setItem(...)
localStorage.removeItem(...)
sessionStorage.getItem(...)
sessionStorage.setItem(...)
sessionStorage.removeItem(...)
```

### Navigator
```typescript
// ❌ These will break SSR:
navigator.userAgent
navigator.language
navigator.clipboard
navigator.geolocation
```

## Guard Pattern — isPlatformBrowser()

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({...})
export class MyComponent {
  private readonly platformId = inject(PLATFORM_ID);

  someMethod() {
    if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
      window.scrollTo(0, 0);
      const width = window.innerWidth;
      document.title = 'New Title';
    }
  }
}
```

## Guard Pattern — StorageMockService

```typescript
import { StorageMockService } from '@core/services/storage-mock.service';

@Component({...})
export class MyComponent {
  private readonly storage = inject(StorageMockService);

  saveData() {
    // ✅ Safe — StorageMockService handles SSR internally
    this.storage.setLocal('key', value);
    const data = this.storage.getLocal('key');
    this.storage.removeLocal('key');
  }
}
```

## Guard Pattern — Lifecycle Hooks

```typescript
@Component({...})
export class MyComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    // AfterViewInit only runs in browser, but guard anyway for safety
    if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
      this.initScrollListener();
    }
  }

  private initScrollListener() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }
}
```

## Guard Pattern — Third-Party Libraries

```typescript
@Component({...})
export class MyComponent {
  private readonly platformId = inject(PLATFORM_ID);

  initChart() {
    if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
      // Third-party libraries that depend on DOM/window
      import('chart.js').then(Chart => {
        // Initialize chart
      });
    }
  }
}
```

## Detection Patterns

Scan for these regex patterns in `.ts` files:

```
/window\.\w+/          → Unguarded window access
/document\.\w+/        → Unguarded document access
/localStorage\.\w+/    → Direct localStorage (should use StorageMockService)
/sessionStorage\.\w+/  → Direct sessionStorage (should use StorageMockService)
/navigator\.\w+/       → Unguarded navigator access
```

Then verify each match is wrapped in `isPlatformBrowser()` check.

## Output Format

```
SSR SAFETY AUDIT for {file}

✅ PASS: No unguarded window access
✅ PASS: StorageMockService used for storage
✅ PASS: isPlatformBrowser() guard present
⚠️ WARNING: window.setTimeout on line 45 — consider guarding for SSR
❌ VIOLATION: localStorage.getItem on line 23 — use StorageMockService
❌ VIOLATION: document.querySelector on line 67 — guard with isPlatformBrowser()
🔒 SECURITY: sessionStorage.setItem on line 89 — use StorageMockService + add SSR guard
```

## Automated SSR Check Script

```bash
# Find unguarded browser API usage in Angular code
echo "=== SSR Safety Check ==="

# Check for direct localStorage/sessionStorage
grep -rn "localStorage\.\|sessionStorage\." src/app/ --include="*.ts" | grep -v "StorageMock" | grep -v ".spec.ts" | grep -v "storage-mock"
echo "---"

# Check for unguarded window/document access
grep -rn "window\.\|document\.\|navigator\." src/app/ --include="*.ts" | grep -v "isPlatformBrowser" | grep -v ".spec.ts" | grep -v "// SSR"
echo "---"

echo "=== Done ==="
```

