# Avatar Component Implementation Guide

## Introducción

El componente `Avatar` es un componente reutilizable que permite mostrar imágenes de usuario, iniciales o iconos de fallback de manera consistente en toda la aplicación.

## Características

- **Múltiples tamaños**: XS, SM, MD, LG, XL, 2XL
- **Tres variantes**: Circular, Rounded, Square
- **Fallback automático**: Iniciales → Icono por defecto
- **Estados de carga**: Animación de pulso durante carga
- **Badge opcional**: Para mostrar estado (online, offline, etc.)
- **Manejo de errores**: Fallback automático si falla la carga de imagen

## Uso Básico

### Avatar con imagen
```typescript
<app-avatar
  src="https://example.com/avatar.jpg"
  alt="Usuario"
  size="md"
  variant="circular">
</app-avatar>
```

### Avatar con iniciales
```typescript
<app-avatar
  initials="JD"
  size="lg"
  variant="rounded">
</app-avatar>
```

### Avatar con badge de estado
```typescript
<app-avatar
  src="https://example.com/avatar.jpg"
  alt="Usuario online"
  size="lg"
  [showBadge]="true">
  <div slot="badge" class="tw-w-full tw-h-full tw-bg-emerald-green-500 tw-rounded-full tw-border-2 tw-border-white"></div>
</app-avatar>
```

## Props

| Prop | Tipo | Valor por defecto | Descripción |
|------|------|-------------------|-------------|
| `src` | `string` | `''` | URL de la imagen del avatar |
| `alt` | `string` | `'Avatar'` | Texto alternativo para la imagen |
| `initials` | `string` | `''` | Iniciales a mostrar si no hay imagen |
| `size` | `AvatarSize` | `'md'` | Tamaño del avatar |
| `variant` | `AvatarVariant` | `'circular'` | Forma del avatar |
| `showBadge` | `boolean` | `false` | Mostrar badge en la esquina |
| `loading` | `boolean` | `false` | Estado de carga |

## Tipos

```typescript
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';
```

## Tamaños

- **XS**: 24x24px (w-6 h-6)
- **SM**: 32x32px (w-8 h-8)
- **MD**: 48x48px (w-12 h-12)
- **LG**: 64x64px (w-16 h-16)
- **XL**: 80x80px (w-20 h-20)
- **2XL**: 128x128px (w-32 h-32)

## Variantes

- **Circular**: Bordes completamente redondeados (rounded-full)
- **Rounded**: Bordes ligeramente redondeados (rounded-lg)
- **Square**: Sin bordes redondeados (rounded-none)

## Estados

### Estado de carga
```typescript
<app-avatar
  src="https://example.com/avatar.jpg"
  [loading]="true">
</app-avatar>
```

### Con badge personalizado
```typescript
<app-avatar
  src="https://example.com/avatar.jpg"
  [showBadge]="true">
  <div slot="badge" class="tw-w-full tw-h-full tw-bg-coral-500 tw-rounded-full tw-border-2 tw-border-white"></div>
</app-avatar>
```

## Ejemplos de Uso

### En un perfil de usuario
```typescript
<div class="tw-flex tw-items-center tw-space-x-3">
  <app-avatar
    [src]="user.avatar"
    [alt]="user.name"
    size="lg"
    variant="circular">
  </app-avatar>
  <div>
    <h3 class="tw-font-medium">{{ user.name }}</h3>
    <p class="tw-text-gray-500">{{ user.email }}</p>
  </div>
</div>
```

### En una lista de comentarios
```typescript
<div class="tw-flex tw-space-x-3">
  <app-avatar
    [initials]="getInitials(comment.author)"
    size="sm"
    variant="circular">
  </app-avatar>
  <div class="tw-flex-1">
    <p class="tw-text-sm">{{ comment.text }}</p>
    <span class="tw-text-xs tw-text-gray-500">{{ comment.author }}</span>
  </div>
</div>
```

### Avatar de negocio con logo
```typescript
<app-avatar
  [src]="business.logo"
  [alt]="business.name"
  size="xl"
  variant="rounded">
</app-avatar>
```

## Colores de Marca

El componente utiliza automáticamente los colores de marca del sistema:
- **Fondo por defecto**: `emerald-green-100`
- **Texto por defecto**: `emerald-green-700`
- **Icono por defecto**: `emerald-green-400`

## Accesibilidad

- Siempre incluye `alt` descriptivo para las imágenes
- El componente maneja automáticamente el fallback a iniciales o icono
- Las iniciales son legibles con buen contraste
- El badge es opcional y no interfiere con la legibilidad

## Mejores Prácticas

1. **Usa tamaños apropiados**: SM para listas, MD para formularios, LG/XL para perfiles
2. **Proporciona fallbacks**: Siempre incluye iniciales cuando sea posible
3. **Alt text descriptivo**: Usa nombres de usuario o descripciones útiles
4. **Consistencia**: Mantén el mismo variant en contextos similares
5. **Estados de carga**: Usa loading=true durante la carga de imágenes

## Integración

Para usar el componente en tu módulo:

```typescript
import { Avatar } from '@app/components/ui';

@Component({
  // ...
  imports: [Avatar],
  // ...
})
```
