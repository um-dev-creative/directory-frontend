# Sub-Agent: UI Library Builder

**Parent Agent:** Angular UI Developer Agent  
**Trigger:** When a new reusable UI design-system component is needed, or an existing one needs extension

## Purpose

Create or extend components in `src/app/components/ui/` following the established design system patterns used by Button, Avatar, Badge, Skeleton, Input, Modal, etc.

## Existing UI Components Reference

| Component | Path | Selector |
|---|---|---|
| Button | `ui/buttons/button.ts` | `<app-button>` |
| Avatar | `ui/avatars/avatar.ts` | `<app-avatar>` |
| Badge | `ui/badges/badge.ts` | `<app-badge>` |
| Alert | `ui/alerts/alert.ts` | `<app-alert>` |
| Input | `ui/inputs/input.ts` | `<app-input>` |
| Modal | `ui/modals/modal.ts` | `<app-modal>` |
| Skeleton | `ui/skeletons/skeleton.ts` | `<app-skeleton>` |
| Tooltip | `ui/tooltips/tooltip.ts` | `<app-tooltip>` |
| Icon | `ui/icons/icon.ts` | `<app-icon>` |

## Variant System

All UI components use a shared `ui-variant.ts` for type definitions:

```typescript
// src/app/components/ui/ui-variant.ts
export type ButtonVariant = 'primary' | 'secondary' | 'alert' | 'success' | 'info' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';
```

When adding a new UI component, add its types here.

## UI Component Pattern

```typescript
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type {Component}Variant = 'default' | 'primary' | 'secondary';
export type {Component}Size = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-{component}',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClasses()">
      <ng-content />
    </div>
  `
})
export class {Component}Component {
  readonly variant = input<{Component}Variant>('default');
  readonly size = input<{Component}Size>('md');
  readonly disabled = input<boolean>(false);

  protected computedClasses(): string {
    const base = 'tw-inline-flex tw-items-center tw-transition-all';
    const variants: Record<{Component}Variant, string> = {
      default: 'tw-bg-gray-100 tw-text-gray-800',
      primary: 'tw-bg-emerald-green-500 tw-text-white hover:tw-bg-emerald-green-600',
      secondary: 'tw-bg-coral-500 tw-text-white hover:tw-bg-coral-600',
    };
    const sizes: Record<{Component}Size, string> = {
      sm: 'tw-text-xs tw-px-2 tw-py-1',
      md: 'tw-text-sm tw-px-3 tw-py-2',
      lg: 'tw-text-base tw-px-4 tw-py-3',
    };
    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  }
}
```

## Export Registration

After creating a new UI component, add it to `src/app/components/ui/index.ts`:

```typescript
export * from './buttons/button';
export * from './avatars/avatar';
// ... existing exports ...
export * from './{category}/{component}'; // Add new export here
```

## Design System Colors

| Token | Tailwind | CSS Variable | Use Case |
|---|---|---|---|
| Emerald Green | `tw-bg-emerald-green-500` | `rgb(var(--color-primary))` | Primary actions, headers |
| Coral | `tw-bg-coral-500` | `rgb(var(--color-secondary))` | Secondary, destructive |
| Sky Blue | `tw-bg-sky-blue-300` | `var(--sky-300)` | Info, highlights |
| Beige | `tw-bg-beige-100` | `var(--beige-100)` | Backgrounds, neutral |

## Accessibility Requirements

Every UI component must:
- Include appropriate ARIA attributes (`role`, `aria-label`, `aria-disabled`)
- Support keyboard navigation where applicable
- Maintain WCAG 2.1 AA color contrast
- Handle focus states visibly

## Folder Structure

```
src/app/components/ui/{category}/
├── {component}.ts           # Component class + template (inline or external)
├── {component}.css          # Component-specific styles (minimal)
└── {component}.spec.ts      # Unit tests
```

