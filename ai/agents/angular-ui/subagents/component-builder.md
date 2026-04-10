# Sub-Agent: Component Builder

**Parent Agent:** Angular UI Developer Agent  
**Trigger:** When a new standalone component needs to be scaffolded

## Purpose

Generate a complete, production-ready Angular standalone component with TypeScript class, HTML template, CSS, and co-located spec file.

## Decision Tree

```
Is it a reusable UI primitive? → Place in src/app/components/ui/{category}/
Is it a feature-specific view?  → Place in src/app/features/{feature}/
Is it a layout element?         → Place in src/app/layout/
```

## Generated Artifacts

### 1. TypeScript Class

```typescript
import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// Feature-specific imports...

@Component({
  selector: 'app-{name}',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    // All template dependencies listed explicitly
  ],
  templateUrl: './{name}.component.html',
  styleUrls: ['./{name}.component.css']
})
export class {Name}Component {
  // ---- Inputs (signal-based, Angular 20) ----
  readonly items = input<ItemModel[]>([]);
  readonly loading = input<boolean>(false);

  // ---- Outputs ----
  readonly itemSelected = output<ItemModel>();

  // ---- Local state (Signals only) ----
  protected readonly isExpanded = signal(false);

  // ---- Services ----
  private readonly logger = inject(LoggerService);
  private readonly notification = inject(NotificationService);

  // ---- Methods ----
  onSelect(item: ItemModel): void {
    this.itemSelected.emit(item);
  }
}
```

### 2. HTML Template

```html
<!-- {Name}Component -->
@if (loading()) {
  <app-skeleton [lines]="3" />
} @else {
  <div class="tw-flex tw-flex-col tw-gap-4 tw-p-4">
    <h2 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700">
      {{ 'feature.section.title' | translate }}
    </h2>

    @for (item of items(); track item.id) {
      <div
        class="tw-cursor-pointer tw-rounded-lg tw-border tw-border-emerald-green-200 tw-p-4 hover:tw-bg-emerald-green-50 tw-transition-colors"
        (click)="onSelect(item)"
        role="button"
        [attr.aria-label]="item.name">
        <span class="tw-text-gray-800">{{ item.name }}</span>
      </div>
    } @empty {
      <p class="tw-text-gray-500 tw-text-sm">{{ 'common.no_items' | translate }}</p>
    }
  </div>
}
```

### 3. CSS

```css
/* Component-specific styles — prefer Tailwind utility classes */
/* Only add custom CSS when Tailwind utilities are insufficient */
```

### 4. Spec File

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { {Name}Component } from './{name}.component';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';

describe('{Name}Component', () => {
  let component: {Name}Component;
  let fixture: ComponentFixture<{Name}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [{Name}Component, TranslateModule.forRoot()],
      providers: [
        { provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['info', 'error']) },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['success', 'error']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent({Name}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should render loading state', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
  });

  it('should emit itemSelected on click', () => {
    const item = { id: '1', name: 'Test' };
    spyOn(component.itemSelected, 'emit');
    component.onSelect(item as any);
    expect(component.itemSelected.emit).toHaveBeenCalledWith(item as any);
  });
});
```

## SSR Safety Rules

Every new component must pass this checklist before completion:

| Check | Correct Pattern |
|---|---|
| `window` access | `if (isPlatformBrowser(this.platformId)) { window... }` |
| `localStorage` | `this.storage.getLocal('key')` via `StorageMockService` |
| `document` | Guard with `isPlatformBrowser()` |
| DOM manipulation | Use Angular refs, not direct DOM calls |

## Brand Color Quick Reference

| Semantic | Tailwind Class |
|---|---|
| Primary background | `tw-bg-emerald-green-500` |
| Primary text | `tw-text-emerald-green-700` |
| Primary border | `tw-border-emerald-green-200` |
| Primary light bg | `tw-bg-emerald-green-50` |
| Secondary/alert | `tw-bg-coral-500` |
| Info | `tw-bg-sky-blue-300` |
| Neutral | `tw-bg-beige-100` |

