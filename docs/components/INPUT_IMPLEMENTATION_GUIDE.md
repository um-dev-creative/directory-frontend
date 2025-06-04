# Guía de Implementación - Componente Input

## Descripción General

El componente `Input` es un componente fundamental que forma parte del sistema de diseño de la marca. Proporciona una interfaz consistente y accesible para la entrada de datos del usuario, manteniendo la coherencia visual con los colores de marca.

## Características Principales

### ✨ Funcionalidades
- **Validación visual**: Estados de éxito, error, información y por defecto
- **Tamaños múltiples**: Pequeño (sm), mediano (md) y grande (lg)
- **Tipos de input**: text, email, password, number, tel, url, search
- **Iconos**: Soporte para iconos al inicio y final del input
- **Accesibilidad**: Implementación completa de ARIA y navegación por teclado
- **Reactive Forms**: Compatible con Angular Reactive Forms
- **Funciones adicionales**: Botón de limpiar, campos requeridos, solo lectura

### 🎨 Variantes de Color
- **Default**: Usando colores emerald-green para focus
- **Success**: Verde emerald para estados exitosos
- **Error**: Coral para mensajes de error
- **Info**: Sky-blue para información adicional

### 📏 Tamaños Disponibles
- **sm**: Altura 36px (9 en Tailwind) - Para espacios compactos
- **md**: Altura 44px (11 en Tailwind) - Tamaño estándar (default)
- **lg**: Altura 52px (13 en Tailwind) - Para mayor prominencia

## Uso Básico

### Importación
```typescript
import { Input } from './components/ui/inputs/input';

@Component({
  imports: [Input]
})
```

### Template Básico
```html
<app-input
  label="Nombre completo"
  placeholder="Ingresa tu nombre"
  [(ngModel)]="userName">
</app-input>
```

## Ejemplos de Uso

### 1. Input Básico con Validación
```html
<app-input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  [required]="true"
  variant="error"
  errorMessage="Email requerido"
  [(ngModel)]="userEmail">
</app-input>
```

### 2. Input con Iconos
```html
<app-input
  label="Buscar"
  placeholder="Buscar productos..."
  [leadingIcon]="true"
  [clearable]="true"
  [(ngModel)]="searchTerm">
  
  <svg slot="leading-icon" class="tw-w-4 tw-h-4 tw-text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
</app-input>
```

### 3. Input en Formularios Reactivos
```typescript
// Component
export class MyFormComponent {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  getFieldVariant(fieldName: string): InputVariant {
    const field = this.form.get(fieldName);
    if (field?.invalid && (field.dirty || field.touched)) return 'error';
    if (field?.valid && field.value) return 'success';
    return 'default';
  }
}
```

```html
<!-- Template -->
<form [formGroup]="form">
  <app-input
    label="Nombre"
    [required]="true"
    [variant]="getFieldVariant('name')"
    formControlName="name">
  </app-input>
  
  <app-input
    label="Email"
    type="email"
    [required]="true"
    [variant]="getFieldVariant('email')"
    formControlName="email">
  </app-input>
</form>
```

## API del Componente

### Props (Inputs)

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `''` | Etiqueta del input |
| `placeholder` | `string` | `''` | Texto de placeholder |
| `helperText` | `string` | `''` | Texto de ayuda |
| `errorMessage` | `string` | `''` | Mensaje de error |
| `type` | `InputType` | `'text'` | Tipo de input HTML |
| `variant` | `InputVariant` | `'default'` | Variante visual |
| `size` | `InputSize` | `'md'` | Tamaño del input |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readonly` | `boolean` | `false` | Estado de solo lectura |
| `required` | `boolean` | `false` | Campo requerido |
| `clearable` | `boolean` | `false` | Mostrar botón limpiar |
| `leadingIcon` | `boolean` | `false` | Espacio para icono inicial |
| `trailingIcon` | `boolean` | `false` | Espacio para icono final |
| `fullWidth` | `boolean` | `true` | Ancho completo |

### Eventos (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `inputChange` | `EventEmitter<string>` | Emitido cuando cambia el valor |
| `inputFocus` | `EventEmitter<void>` | Emitido al recibir focus |
| `inputBlur` | `EventEmitter<void>` | Emitido al perder focus |

### Tipos

```typescript
export type InputVariant = 'default' | 'success' | 'error' | 'info';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
```

## Slots para Contenido

### Leading Icon
```html
<app-input [leadingIcon]="true">
  <svg slot="leading-icon" class="tw-w-4 tw-h-4">
    <!-- Tu icono aquí -->
  </svg>
</app-input>
```

### Trailing Icon
```html
<app-input [trailingIcon]="true">
  <div slot="trailing-icon">
    <!-- Tu contenido aquí -->
  </div>
</app-input>
```

## Accesibilidad

### Características Implementadas
- **ARIA Labels**: `aria-describedby` para texto de ayuda
- **ARIA Invalid**: `aria-invalid` para estados de error
- **Focus Management**: Indicadores visuales claros de focus
- **Keyboard Navigation**: Navegación completa por teclado
- **Screen Reader Support**: Etiquetas y descripciones apropiadas

### Recomendaciones
- Siempre proporciona una `label` descriptiva
- Usa `helperText` para instrucciones adicionales
- Proporciona `errorMessage` específicos y útiles
- Marca campos como `required` cuando sea necesario

## Mejores Prácticas

### 1. Consistencia Visual
```html
<!-- ✅ Bien: Usar variantes apropiadas -->
<app-input variant="error" errorMessage="Campo requerido">
<app-input variant="success" helperText="✓ Email válido">

<!-- ❌ Mal: Variante incorrecta para el contexto -->
<app-input variant="success" errorMessage="Campo requerido">
```

### 2. Validación de Formularios
```typescript
// ✅ Bien: Validación reactiva
getFieldVariant(fieldName: string): InputVariant {
  const field = this.form.get(fieldName);
  if (field?.invalid && (field.dirty || field.touched)) return 'error';
  if (field?.valid && field.value) return 'success';
  return 'default';
}
```

### 3. Uso de Iconos
```html
<!-- ✅ Bien: Iconos que mejoran la UX -->
<app-input type="search" [leadingIcon]="true">
  <svg slot="leading-icon"><!-- Icono de búsqueda --></svg>
</app-input>

<!-- ✅ Bien: Función de limpiar para mejor UX -->
<app-input [clearable]="true" [(ngModel)]="searchTerm">
```

### 4. Mensajes de Error Útiles
```html
<!-- ✅ Bien: Mensajes específicos -->
<app-input 
  errorMessage="El email debe tener un formato válido"
  helperText="Ejemplo: usuario@dominio.com">

<!-- ❌ Mal: Mensajes genéricos -->
<app-input errorMessage="Error">
```

## Integración con Tailwind CSS

El componente utiliza las clases custom de Tailwind definidas en tu configuración:

```css
/* Colores utilizados */
.tw-text-emerald-green-500
.tw-border-emerald-green-500
.tw-ring-emerald-green-500
.tw-text-coral-500
.tw-border-coral-500
.tw-text-sky-blue-500
.tw-border-sky-blue-500
```

## Compatibilidad

- **Angular**: 15+
- **Reactive Forms**: ✅ Completamente compatible
- **Template-driven Forms**: ✅ Compatible con ngModel
- **SSR**: ✅ Compatible con Angular Universal
- **Standalone Components**: ✅ Componente standalone

## Próximas Mejoras

- [ ] Soporte para máscaras de input
- [ ] Validación en tiempo real
- [ ] Autocompletado personalizable
- [ ] Soporte para inputs de tipo fecha/hora
- [ ] Temas personalizables
- [ ] Animaciones avanzadas de estado
