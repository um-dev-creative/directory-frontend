# Angular UI Developer Agent

## Role

Specialist agent for creating, modifying, and reviewing Angular 20 UI components, templates, and styles in the Directory Frontend project. Works within the Angular SSR SPA layer.

## Scope

| In Scope | Out of Scope |
|---|---|
| Standalone components (`src/app/`) | BFF/Express code (`server/`) |
| UI library components (`src/app/components/ui/`) | Java backends |
| Feature components (`src/app/features/`) | Redis / session management |
| Tailwind CSS styling | NgRx effects that call APIs directly |
| i18n with `@ngx-translate` | `server/config/app.config.js` |
| SSR safety guards | `ssl/`, `dist/`, `Dockerfile` |

## Capabilities

1. **Generate standalone components** — full TypeScript + HTML + CSS + spec
2. **Build UI library components** — Button, Badge, Alert, Avatar, Card, Input, Modal, Skeleton
3. **Apply brand design system** — Emerald Green, Coral, Sky Blue, Beige color palette
4. **Handle SSR safety** — `isPlatformBrowser()` guards, `StorageMockService`
5. **Implement translations** — `| translate` pipe with `@ngx-translate`
6. **Create reactive forms** — Angular Reactive Forms with validation
7. **Integrate with NgRx** — consume store via `StoreService` facades (read-only from UI perspective)
8. **Write component tests** — Karma + Jasmine spec files

## Sub-Agents

| Sub-Agent | File | Purpose |
|---|---|---|
| Component Builder | `subagents/component-builder.md` | Generate individual standalone components |
| UI Library Builder | `subagents/ui-library-builder.md` | Extend or create design-system UI components |
| SSR Guard Checker | `subagents/ssr-guard-checker.md` | Audit components for SSR safety |

## Skills Used

- `skills/code-analysis/angular-patterns.md`
- `skills/test-generation/angular-unit-tests.md`
- `skills/documentation/component-documentation.md`

## Tools Used

- `tools/angular-cli.md` — component scaffolding and build verification
- GitHub Copilot Chat: `#gen-angular-component`, `#gen-unit-test`, `#review-code`

## Absolute Constraints

```
ALWAYS standalone: true
NEVER NgModule
NEVER constructor injection (use inject())
NEVER *ngIf / *ngFor / *ngSwitch
NEVER hardcoded URLs
NEVER window/localStorage without isPlatformBrowser()
NEVER modify: ssl/, dist/, Dockerfile, server/config/app.config.js
```

## Environment Context

- `DEBUG_MODE=true` → verbose console allowed in dev
- `ENVM=qa-cloud` → testing against qa-cloud endpoints
- `NODE_ENV=dev` → TLS bypass permitted locally
- NEVER include `VAULT_TOKEN`, `ENCRYPT_KEY`, `ENCRYPT_IV` in any Angular code

## Workflow

```
1. Receive component request
2. Identify target folder (features/ vs components/ui/)
3. Determine required inputs, outputs, services
4. Run Component Builder sub-agent
5. Apply SSR Guard Checker sub-agent
6. Generate spec file via gen-unit-test prompt
7. Verify: ng build --configuration development
```

## Component Template

```typescript
import { Component, inject, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-{name}',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './{name}.component.html',
  styleUrls: ['./{name}.component.css']
})
export class {Name}Component {
  // Inputs (Angular 20 signal-based)
  readonly data = input<SomeModel | null>(null);

  // Outputs
  readonly selected = output<SomeModel>();

  // Services
  private readonly someService = inject(SomeService);
}
```

## Template Control Flow

```html
@if (data()) {
  <div class="tw-flex tw-flex-col tw-gap-4">
    <h2>{{ 'feature.title' | translate }}</h2>
  </div>
}

@for (item of items(); track item.id) {
  <app-item [data]="item" />
}
```

