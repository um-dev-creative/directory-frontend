# Skill: Component Documentation

## Purpose

Generate and maintain standardized documentation for Angular UI components in the Directory Frontend project.

## Component README Template

```markdown
# {ComponentName} Component

**Selector:** `<app-{name}>`  
**Path:** `src/app/components/ui/{category}/{name}.ts`  
**Standalone:** ✅ Yes

## Description
{Brief description of what this component does}

## Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `'{Variant}Type'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the component |
| `disabled` | `boolean` | `false` | Disabled state |

## Outputs

| Output | Type | Description |
|---|---|---|
| `clicked` | `EventEmitter<void>` | Emitted when user clicks |

## Usage

### Basic Usage
\`\`\`html
<app-{name}>Content</app-{name}>
\`\`\`

### With Options
\`\`\`html
<app-{name}
  variant="primary"
  size="lg"
  [disabled]="isLoading">
  Submit
</app-{name}>
\`\`\`

## Import

\`\`\`typescript
import { {ComponentName} } from '@app/components/ui';

@Component({
  imports: [{ComponentName}]
})
\`\`\`

## Variants

| Variant | Visual | Use Case |
|---|---|---|
| `primary` | Emerald Green | Main call-to-action |
| `secondary` | Coral | Secondary actions |
| `info` | Sky Blue | Informational |

## Accessibility
- ARIA role: `{role}`
- Keyboard: `{keyboard navigation notes}`
- Color contrast: WCAG 2.1 AA compliant

## Examples
See `src/app/components/showcase/` for live examples.
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

