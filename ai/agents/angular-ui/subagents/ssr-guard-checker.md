# Sub-Agent: SSR Guard Checker

**Parent Agent:** Angular UI Developer Agent  
**Trigger:** Automatically runs after any component is generated or modified

## Purpose

Audit Angular components for SSR (Server-Side Rendering) compatibility. Detect browser-only code patterns and apply the appropriate `isPlatformBrowser()` guards or `StorageMockService` wrappers.

## Detection Rules

### Rule 1 — Direct `window` access

```typescript
// ❌ FORBIDDEN
window.scrollTo(0, 0);
const width = window.innerWidth;

// ✅ CORRECT
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

private readonly platformId = inject(PLATFORM_ID);

if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
  window.scrollTo(0, 0);
}
```

### Rule 2 — Direct `localStorage` / `sessionStorage` access

```typescript
// ❌ FORBIDDEN
localStorage.setItem('key', value);
const data = sessionStorage.getItem('key');

// ✅ CORRECT
import { StorageMockService } from '@core/services/storage-mock.service';

private readonly storage = inject(StorageMockService);

this.storage.setLocal('key', value);
const data = this.storage.getLocal('key');
```

### Rule 3 — Direct `document` access

```typescript
// ❌ FORBIDDEN
document.getElementById('element');
document.title = 'New Title';

// ✅ CORRECT
import { DOCUMENT } from '@angular/common';
private readonly doc = inject(DOCUMENT);

// Or guard it:
if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
  this.doc.getElementById('element');
}
```

### Rule 4 — `navigator` access

```typescript
// ❌ FORBIDDEN
navigator.geolocation.getCurrentPosition(...);

// ✅ CORRECT
if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
  navigator.geolocation.getCurrentPosition(...);
}
```

### Rule 5 — `afterNextRender` / `afterRender` for DOM ops

```typescript
// ✅ For DOM interactions after render
import { afterNextRender } from '@angular/core';

constructor() {
  afterNextRender(() => {
    // DOM operations here — only runs in browser  // SSR: browser-only
  });
}
```

## Audit Output Format

For each violation found, report:

```
⚠️ SSR VIOLATION in {file}:{line}
   Pattern: {what was found}
   Fix: {corrected code snippet}
   Comment needed: // SSR: browser-only
```

## Platform Check Injection Pattern

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({ standalone: true, ... })
export class MyComponent {
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
      // Safe browser code here
    }
  }
}
```

## Lifecycle Hook Safety

| Hook | Runs in SSR? | Safe for Browser APIs? |
|---|---|---|
| `constructor` | ✅ Yes | ❌ No |
| `ngOnInit` | ✅ Yes | ❌ No (guard required) |
| `ngAfterViewInit` | ✅ Yes | ❌ No (guard required) |
| `afterNextRender` | ❌ No | ✅ Yes |
| `afterRender` | ❌ No | ✅ Yes |

