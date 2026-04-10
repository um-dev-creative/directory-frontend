# /gen-component — Generate Angular Standalone Component

Generates a complete Angular 20 standalone component following project conventions.

## Usage

```
/gen-component <name> [--feature <feature>] [--type ui|feature|layout]
```

**Examples:**
- `/gen-component product-card --feature partner --type feature`
- `/gen-component favorites-list --feature community-member`
- `/gen-component main-banner --type layout`
- `/gen-component price-badge --type ui`

---

## What to generate

For the given name (in kebab-case), create the following files:

### 1. `<name>.component.ts`

For **new standalone components** (type `feature`, `layout`, `ui` without ControlValueAccessor):

```typescript
import { Component, inject, input, output, signal, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-<name>',
  standalone: true,
  imports: [
    TranslateModule,
    // Add additional imports as needed (RouterModule, ReactiveFormsModule, etc.)
  ],
  templateUrl: './<name>.component.html',
  styleUrls: ['./<name>.component.css']
})
export class <NameComponent> {
  // Inputs (signal-based — Angular 20)
  // readonly data = input<MyModel | null>(null);

  // Outputs (signal-based — Angular 20)
  // readonly selected = output<MyModel>();

  // Services — use inject()
  // private readonly myService = inject(MyService);

  // Local state with signals
  // protected readonly loading = signal(false);
  // protected readonly hasContent = computed(() => this.data() !== null);
}
```

For components implementing **ControlValueAccessor** (form inputs):

```typescript
import { Component, Input, Output, EventEmitter, inject, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-<name>',
  standalone: true,
  imports: [TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => <NameComponent>),
      multi: true
    }
  ],
  templateUrl: './<name>.component.html',
  styleUrls: ['./<name>.component.css']
})
export class <NameComponent> implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  private onChange = (_v: string) => {};
  private onTouched = () => {};

  writeValue(v: string): void { this.value = v || ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
}
```

### 2. `<name>.component.html`

- Use `@if` / `@for` / `@let` — **never** `*ngIf` / `*ngFor`
- Visible text with `{{ 'translation.key' | translate }}` (or `<!-- TODO: i18n -->` if the key is new)
- CSS classes with Tailwind v4 — use the project's brand colors:
  - Primary: `emerald-green-{50-900}`
  - Alert/Error: `coral-{50-900}`
  - Info/Secondary: `sky-blue-{50-900}`
  - Backgrounds: `beige-{50-900}`

```html
<section class="flex flex-col gap-4 p-4">
  @if (data()) {
    <h2 class="text-emerald-green-700 font-semibold">
      {{ 'feature.<name>.title' | translate }}
    </h2>
  }

  @for (item of items(); track item.id) {
    <div class="rounded-lg border border-gray-200 p-3">
      {{ item.name }}
    </div>
  }
</section>
```

### 3. `<name>.component.css`

Empty by default (prefer Tailwind in the template). Only add CSS for animations or styles Tailwind cannot handle.

### 4. `<name>.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { <NameComponent> } from './<name>.component';

describe('<NameComponent>', () => {
  let component: <NameComponent>;
  let fixture: ComponentFixture<<NameComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        <NameComponent>,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(<NameComponent>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // Add tests for each input(), output() or @Input/@Output and business logic
});
```

If the component injects services, mock them:

```typescript
import { HttpClientTestingModule } from '@angular/common/http/testing';

// In configureTestingModule:
imports: [<NameComponent>, TranslateModule.forRoot(), HttpClientTestingModule],
providers: [
  { provide: MyService, useValue: jasmine.createSpyObj('MyService', ['method']) }
]
```

---

## Where to place the files

| Type | Path |
|------|------|
| `ui` | `src/app/components/ui/<name>/` |
| `feature` | `src/app/features/<feature>/components/<name>/` |
| `layout` | `src/app/layout/<name>/` |
| No type | `src/app/components/<name>/` |

---

## Check existing UI components before creating

Before creating a new component, check if it already exists in `src/app/components/ui/`:

| Component | Selector |
|-----------|----------|
| `app-button` | Button with variants: primary, secondary, outline, alert, ghost, etc. |
| `app-badge` | Status/category badge label |
| `app-alert` | Alert: success/warning/error/info |
| `app-avatar` | User avatar with initials fallback |
| `app-card` | Card container |
| `app-input` | Form input with validation |
| `app-select` | Form select |
| `app-textarea` | Form textarea |
| `app-modal` | Modal/dialog overlay |
| `app-skeleton` | Animated loading placeholder |
| `app-tooltip` | Hover/focus tooltip |
| `app-icon` | SVG icon set |

---

## Checklist before delivering

- [ ] `standalone: true` in the decorator
- [ ] Injection with `inject()`, not constructor (except ControlValueAccessor when required)
- [ ] No `*ngIf`, `*ngFor`, or `*ngSwitch` in the template
- [ ] No `CommonModule` unless `NgClass`, `AsyncPipe`, or another directive from that module is used
- [ ] Text with `| translate` (or `<!-- TODO: i18n -->` if the key is new)
- [ ] No hardcoded URLs — use `DFC` or `environment`
- [ ] No direct access to `window`/`document`/`localStorage` without `isPlatformBrowser()` / `StorageMockService`
- [ ] No secrets, OAuth tokens, or AES keys in the component
- [ ] `.spec.ts` file created with at least the basic creation test
- [ ] Services mocked in the spec (no real HTTP calls in unit tests)
