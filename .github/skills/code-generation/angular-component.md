# Skill: Angular Component Generation

## Purpose

Generate production-ready Angular 20 standalone components following all Directory Frontend conventions.

## When to Use

- Creating new feature components in `src/app/features/`
- Creating reusable UI components in `src/app/components/ui/`
- Creating layout components in `src/app/layout/`

## Pre-Generation Checklist

Before generating, confirm:
- [ ] Component name (kebab-case, e.g., `partner-card`)
- [ ] Target folder (features vs. UI library vs. layout)
- [ ] Purpose and description
- [ ] Required inputs/outputs
- [ ] Service/store dependencies

## Component TypeScript Template

```typescript
import { Component, inject, input, output, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-{name}',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './{name}.component.html',
  styleUrls: ['./{name}.component.css']
})
export class {Name}Component {
  private readonly platformId = inject(PLATFORM_ID);

  // Signal-based inputs (Angular 20)
  readonly items = input<ItemModel[]>([]);
  readonly loading = input<boolean>(false);

  // Outputs
  readonly itemSelected = output<ItemModel>();

  // Local state — Signals only
  protected readonly isExpanded = signal(false);

  // Services via inject()
  private readonly someService = inject(SomeService);
}
```

## HTML Template Pattern

```html
@if (loading()) {
  <app-skeleton [lines]="3" />
} @else {
  <div class="tw-flex tw-flex-col tw-gap-4 tw-p-4">
    <h2 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700">
      {{ 'feature.section.title' | translate }}
    </h2>

    @for (item of items(); track item.id) {
      <div class="tw-cursor-pointer tw-rounded-lg tw-border tw-border-emerald-green-200 tw-p-4
                  hover:tw-bg-emerald-green-50 tw-transition-colors"
           (click)="itemSelected.emit(item)">
        {{ item.name }}
      </div>
    } @empty {
      <p class="tw-text-gray-500 tw-text-sm">{{ 'common.no_items' | translate }}</p>
    }
  </div>
}
```

## SSR Safety Pattern

```typescript
// Any browser API must be guarded:
if (isPlatformBrowser(this.platformId)) {  // SSR: browser-only
  window.scrollTo(0, 0);
}

// Storage must go through StorageMockService — never directly:
private readonly storage = inject(StorageMockService);
this.storage.setLocal('key', value);  // ✅
localStorage.setItem('key', value);   // ❌
```

## Brand Color Reference

| Use Case | Tailwind Class |
|---|---|
| Primary action | `tw-bg-emerald-green-500` / `tw-text-emerald-green-700` |
| Destructive / alert | `tw-bg-coral-500` |
| Informational | `tw-bg-sky-blue-300` |
| Neutral background | `tw-bg-beige-100` |
| Hover states | `hover:tw-bg-emerald-green-50` |

## UI Component Library Imports

```typescript
import { Button }          from '@app/components/ui/buttons/button';
import { Avatar }          from '@app/components/ui/avatars/avatar';
import { Badge }           from '@app/components/ui/badges/badge';
import { Skeleton }        from '@app/components/ui/skeletons/skeleton';
import { InputComponent }  from '@app/components/ui/inputs/input';
import { Modal }           from '@app/components/ui/modals/modal';
```

## Folder Placement Rules

| Component type | Location |
|---|---|
| Reusable UI primitive | `src/app/components/ui/{category}/` |
| Feature page or section | `src/app/features/{feature}/` |
| Layout element | `src/app/layout/` |

## Files to Generate

For each component, generate:
1. `{name}.component.ts` — TypeScript class
2. `{name}.component.html` — Template with modern control flow
3. `{name}.component.css` — Tailwind CSS styles
4. `{name}.component.spec.ts` — Unit test (co-located)

## Post-Generation Validation

```bash
ng build --configuration development
ng test --no-watch --browsers ChromeHeadlessNoSandbox
```

