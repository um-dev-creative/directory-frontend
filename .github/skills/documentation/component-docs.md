# Skill: Component Documentation

## Purpose

Generate standardized technical documentation for Angular UI components in the Directory Frontend project.

## When to Use

- Documenting new or existing UI components
- Generating README files for component libraries
- Creating usage guides and API references

## Component Documentation Template

```markdown
# {ComponentName} Component

**Selector:** `<app-{name}>`
**Path:** `src/app/components/ui/{category}/{name}.ts` or `src/app/features/{feature}/`
**Standalone:** ✅ Yes

## Description
{Brief description of what this component does and when to use it}

## Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `'{Variant}Type'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the component |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Show skeleton/loading state |

## Outputs

| Output | Type | Description |
|---|---|---|
| `clicked` | `void` | Emitted when user clicks |
| `itemSelected` | `ItemModel` | Emitted when an item is selected |

## Import

\`\`\`typescript
import { {ComponentName} } from '@app/components/ui/{category}/{name}';

@Component({
  imports: [{ComponentName}]
})
\`\`\`

## Basic Usage

\`\`\`html
<app-{name}>Content</app-{name}>
\`\`\`

## With Options

\`\`\`html
<app-{name}
  variant="primary"
  size="lg"
  [disabled]="isLoading"
  [loading]="isLoading"
  (clicked)="onAction()">
  Submit
</app-{name}>
\`\`\`

## States

| State | Condition | Visual |
|---|---|---|
| Loading | `loading=true` | `<app-skeleton>` placeholder |
| Empty | `items.length === 0` | Empty state message |
| Error | `error !== null` | Error alert message |
| Default | Data loaded | Normal content |

## Variants

| Variant | Visual | Use Case |
|---|---|---|
| `primary` | Emerald Green (`tw-bg-emerald-green-500`) | Main call-to-action |
| `secondary` | Coral (`tw-bg-coral-500`) | Secondary/destructive |
| `info` | Sky Blue (`tw-bg-sky-blue-300`) | Informational |

## Accessibility
- ARIA role: `{role}`
- Keyboard: `{navigation notes}`
- Color contrast: WCAG 2.1 AA compliant
```

## JSDoc Standards

Every exported class, method, and input must have JSDoc:

```typescript
/**
 * Reusable button component following the LatinHub design system.
 * Supports multiple variants, sizes, and loading states.
 *
 * @example
 * <app-button variant="primary" [loading]="isSubmitting">
 *   Submit
 * </app-button>
 */
@Component({...})
export class ButtonComponent {
  /**
   * Visual style variant of the button.
   * @default 'primary'
   */
  readonly variant = input<ButtonVariant>('primary');

  /**
   * Emits when the button is clicked (disabled state suppresses this).
   */
  readonly buttonClick = output<void>();
}
```

## Documentation File Placement

| Documentation type | Location |
|---|---|
| Component implementation guide | `docs/components/{COMPONENT_NAME}_IMPLEMENTATION_GUIDE.md` |
| Feature documentation | `docs/features/{feature}/README.md` |
| Architecture documentation | `docs/architecture/` |

