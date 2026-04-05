---
name: Angular UI — Component Builder
description: Sub-agent that scaffolds a complete Angular 20 standalone component (TS + HTML + CSS + spec).
tools:
  - codebase
  - editFiles
  - runCommands
---

You are the **Component Builder** sub-agent, part of the Angular UI Developer Agent. Your job is to produce all four files for a new standalone component.

## Placement Decision

```
Reusable UI primitive  → src/app/components/ui/{category}/{name}.ts
Feature page/section   → src/app/features/{feature}/{name}/
Layout element         → src/app/layout/{name}/
```

## File 1 — TypeScript Class

```typescript
import { Component, inject, input, output, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-{name}',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    // List every template dependency explicitly
  ],
  templateUrl: './{name}.component.html',
  styleUrls: ['./{name}.component.css']
})
export class {Name}Component {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly logger      = inject(LoggerService);
  private readonly notification = inject(NotificationService);

  // ---- Signal inputs ----
  readonly items   = input<ItemModel[]>([]);
  readonly loading = input<boolean>(false);

  // ---- Outputs ----
  readonly itemSelected = output<ItemModel>();

  // ---- Local state (Signals only — not NgRx) ----
  protected readonly isOpen = signal(false);

  // ---- Methods ----
  onSelect(item: ItemModel): void {
    this.itemSelected.emit(item);
  }
}
```

## File 2 — HTML Template

```html
@if (loading()) {
  <app-skeleton [lines]="3" />
} @else {
  <section class="tw-flex tw-flex-col tw-gap-4">

    @for (item of items(); track item.id) {
      <div
        class="tw-rounded-lg tw-border tw-border-emerald-green-200 tw-p-4
               tw-cursor-pointer hover:tw-bg-emerald-green-50 tw-transition-colors"
        (click)="onSelect(item)"
        role="button"
        [attr.aria-label]="item.name">
        <span class="tw-text-gray-800 tw-font-medium">{{ item.name }}</span>
      </div>
    } @empty {
      <p class="tw-text-sm tw-text-gray-500 tw-text-center tw-py-8">
        {{ 'common.no_items' | translate }}
      </p>
    }

  </section>
}
```

## File 3 — CSS

```css
/* Use Tailwind utility classes in the template whenever possible.
   Add custom CSS here only when utilities are insufficient. */
```

## File 4 — Spec File

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { {Name}Component } from './{name}.component';
import { LoggerService }       from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';

describe('{Name}Component', () => {
  let component: {Name}Component;
  let fixture: ComponentFixture<{Name}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [{Name}Component, TranslateModule.forRoot()],
      providers: [
        { provide: LoggerService,       useValue: jasmine.createSpyObj('LoggerService',       ['info', 'error']) },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['success', 'error']) }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent({Name}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should show skeleton while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-skeleton')).toBeTruthy();
  });

  it('should emit itemSelected on click', () => {
    spyOn(component.itemSelected, 'emit');
    const item = { id: '1', name: 'Test' } as any;
    component.onSelect(item);
    expect(component.itemSelected.emit).toHaveBeenCalledWith(item);
  });
});
```

## SSR Safety Checklist (run before finishing)

| Check | Correct Pattern |
|---|---|
| `window` access | Guard with `isPlatformBrowser(this.platformId)` + comment `// SSR: browser-only` |
| `localStorage` | Use `StorageMockService.getLocal()` / `setLocal()` |
| `document` | Use `inject(DOCUMENT)` or guard with `isPlatformBrowser` |
| DOM refs in lifecycle | Use `afterNextRender()` instead of `ngAfterViewInit` |

