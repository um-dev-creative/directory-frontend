---
mode: agent
description: Generate a complete standalone Angular component following project conventions
tools:
  - codebase
  - editFiles
  - runCommands
---

# Generate Angular Component

> This prompt activates the **Angular UI Developer Agent**.
> Full agent definition: [agent.md](../ai/agents/angular-ui/agent.md)
> Sub-agents used:
> - [component-builder.md](../ai/agents/angular-ui/subagents/component-builder.md)
> - [ui-library-builder.md](../ai/agents/angular-ui/subagents/ui-library-builder.md)
> - [ssr-guard-checker.md](../ai/agents/angular-ui/subagents/ssr-guard-checker.md)
>
> Skills applied:
> - [angular-patterns.md](../ai/skills/code-analysis/angular-patterns.md)
> - [angular-unit-tests.md](../ai/skills/test-generation/angular-unit-tests.md)
>
> Tools used:
> - [angular-cli.md](../ai/tools/angular-cli.md)
>
> Security constraints: [security-policy.md](../ai/config/security-policy.md)
> Environment constraints: [env-constraints.md](../ai/config/env-constraints.md)

---

## Instructions

Generate a complete, production-ready Angular standalone component based on the user's description.

### Required Input
Ask the user for (if not already provided):
1. **Component name** (e.g. `partner-card`)
2. **Target folder** (e.g. `src/app/features/partner/` or `src/app/components/ui/`)
3. **Purpose** — what the component does
4. **Inputs/Outputs** — `@Input()` and `@Output()` signals needed
5. **Dependencies** — services or stores it needs

### Generation Checklist

Before generating, verify each item:
- [ ] `standalone: true` — REQUIRED, no exceptions
- [ ] `inject()` for all dependencies — NO constructor injection
- [ ] `@if` / `@for` / `@let` control flow — NO `*ngIf` / `*ngFor`
- [ ] All template dependencies listed in `imports: []`
- [ ] `| translate` for user-visible strings (or `// TODO: i18n` comment)
- [ ] `isPlatformBrowser()` guard for any `window` / `localStorage` access
- [ ] Tailwind CSS classes with `tw-` prefix
- [ ] Path aliases: `@core/*`, `@shared/*`, `@app/*`, `@env/*`
- [ ] Spec file co-located in same folder

### Component Template

```typescript
import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-{name}',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './{name}.component.html',
  styleUrls: ['./{name}.component.css']
})
export class {ClassName}Component {
  // Signal inputs (Angular 20)
  readonly someProp = input<string>('');
  readonly someEvent = output<void>();

  // Injected services
  private readonly someService = inject(SomeService);
}
```

### HTML Template

```html
@if (someProp()) {
  <div class="tw-flex tw-flex-col tw-gap-4">
    <h2 class="tw-text-xl tw-font-semibold tw-text-emerald-green-700">
      {{ 'feature.title' | translate }}
    </h2>
  </div>
}

@for (item of items(); track item.id) {
  <app-item [data]="item" />
}
```

### Brand Colors Reference

| Use | Tailwind Class |
|---|---|
| Primary action | `tw-bg-emerald-green-500` |
| Secondary / destructive | `tw-bg-coral-500` |
| Informational | `tw-bg-sky-blue-300` |
| Neutral background | `tw-bg-beige-100` |

### UI Components Available (import from `@app/components/ui`)

```typescript
import { Button } from '@app/components/ui/buttons/button';
import { Avatar } from '@app/components/ui/avatars/avatar';
import { Badge } from '@app/components/ui/badges/badge';
import { Skeleton } from '@app/components/ui/skeletons/skeleton';
import { InputComponent } from '@app/components/ui/inputs/input';
import { Modal } from '@app/components/ui/modals/modal';
```

### Post-Generation

After creating files, run:
```bash
ng build --configuration development
ng test --no-watch --browsers ChromeHeadlessNoSandbox
```
