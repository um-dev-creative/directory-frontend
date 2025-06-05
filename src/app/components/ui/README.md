# Button Component

Un componente de botón### Solid Outline (Borde con hover sólido - estilo Legacy)
```html
<app-button variant="solid-outline">Solid Outline</app-button>
```

### Ghost (Transparente con hover)
```html
<app-button variant="ghost">Botón Ghost</app-button>
```que implementa los colores de marca y sigue las mejores prácticas de diseño.

## Uso Básico

```html
<app-button>Texto del botón</app-button>
```

## Variantes

### Primary (Emerald Green - Color principal de marca)
```html
<app-button variant="primary">Botón Principal</app-button>
```

### Secondary (Sky Blue - Color secundario de marca)
```html
<app-button variant="secondary">Botón Secundario</app-button>
```

### alert (Coral - Para acciones destructivas)
```html
<app-button variant="alert">Eliminar</app-button>
```

### Success (Emerald Green Intenso)
```html
<app-button variant="success">Confirmar</app-button>
```

### Info (Sky Blue Intenso)
```html
<app-button variant="info">Información</app-button>
```

### Outline (Borde con color de marca)
```html
<app-button variant="outline">Botón Outline</app-button>
```

### Solid Outline (Borde con hover sólido - estilo Legacy)
```html
<app-button variant="solid-outline">Solid Outline</app-button>
```

### Bordered (Borde con hover sólido - idéntico a Legacy Outline)
```html
<app-button variant="bordered">Bordered</app-button>
```

### Ghost (Transparente con hover)
```html
<app-button variant="ghost">Botón Ghost</app-button>
```

## Tamaños

```html
<app-button size="sm">Pequeño</app-button>
<app-button size="md">Mediano (default)</app-button>
<app-button size="lg">Grande</app-button>
```

## Estados

### Deshabilitado
```html
<app-button [disabled]="true">Deshabilitado</app-button>
```

### Loading
```html
<app-button [loading]="isLoading">Cargando...</app-button>
```

### Ancho completo
```html
<app-button [fullWidth]="true">Botón de ancho completo</app-button>
```

## Eventos

```html
<app-button (buttonClick)="handleClick($event)">Click me</app-button>
```

## Ejemplo de uso en TypeScript

```typescript
import { Button } from '@app/components/ui';

@Component({
  selector: 'app-example',
  imports: [Button],
  template: `
    <app-button 
      variant="primary" 
      size="md"
      [loading]="isSubmitting"
      (buttonClick)="submitForm()"
    >
      {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
    </app-button>
  `
})
export class ExampleComponent {
  isSubmitting = false;

  submitForm() {
    this.isSubmitting = true;
    // Lógica de envío
  }
}
```

## Características

✅ **Colores de marca**: Utiliza la paleta de colores definida (Emerald Green, Sky Blue, Coral, Beige)
✅ **Accesibilidad**: Focus states, ARIA labels, estados de disabled
✅ **Responsive**: Funciona en todos los tamaños de pantalla
✅ **Estados**: Loading, disabled, hover, active
✅ **Animaciones**: Smooth transitions y hover effects
✅ **TypeScript**: Tipado completo con interfaces
✅ **Standalone**: No requiere imports adicionales
✅ **RouterLink**: Compatible con navegación de Angular

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'solid-outline' \| 'ghost' \| 'alert' \| 'success' \| 'info'` | `'primary'` | Estilo visual del botón |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `disabled` | `boolean` | `false` | Deshabilita el botón |
| `loading` | `boolean` | `false` | Muestra spinner de carga |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo de botón HTML |
| `fullWidth` | `boolean` | `false` | Hace el botón de ancho completo |

## Eventos

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `buttonClick` | `EventEmitter<Event>` | Se emite cuando se hace click en el botón |

## Colores de Marca Utilizados

- **Emerald Green**: `primary`, `success`, `outline`, `ghost`
- **Sky Blue**: `secondary`, `info`  
- **Coral**: `alert`
- **Beige**: Usado en estados hover y focus cuando es apropiado

## Ejemplo en Header

El componente ya está implementado en el header:

```html
<!-- Botón de login -->
<app-button
  variant="secondary"
  size="md"
  class="md:tw-inline-block tw-hidden"
  [routerLink]="['/auth']"
  [queryParams]="{ ref: 'header', isRegistering: false }"
>
  {{ 'menu_header.login_button.title' | translate }}
</app-button>

<!-- Botón de registro -->
<app-button
  variant="alert"
  size="md"
  class="md:tw-inline-block tw-hidden"
  [routerLink]="['/auth']"
  [queryParams]="{ ref: 'header', isRegistering: true }"
>
  {{ 'menu_header.join_now_button.title' | translate }}
</app-button>
```
