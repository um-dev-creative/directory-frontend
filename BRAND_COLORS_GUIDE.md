# Guía de Uso de Colores de Marca

## Paleta de Colores de Marca

### 🌿 Emerald Green (Color Primario)
- **Principal**: `#2E8B57` (emerald-500)
- **Uso**: Botones principales, enlaces importantes, headers
- **Tailwind**: `tw-bg-emerald-green-500`, `tw-text-emerald-green-500`
- **CSS Variable**: `var(--emerald-500)`

### 🪸 Coral (Color Secundario)
- **Principal**: `#FF6F61` (coral-500)
- **Uso**: Botones secundarios, alertas de error, call-to-action
- **Tailwind**: `tw-bg-coral-500`, `tw-text-coral-500`
- **CSS Variable**: `var(--coral-500)`

### 🌤️ Sky Blue (Color de Acento)
- **Principal**: `#87CEEB` (sky-blue-300)
- **Uso**: Información, notificaciones, elementos informativos
- **Tailwind**: `tw-bg-sky-blue-300`, `tw-text-sky-blue-300`
- **CSS Variable**: `var(--sky-300)`

### 🏔️ Beige (Color Neutral)
- **Principal**: `#F5F5DC` (beige-100)
- **Uso**: Fondos, elementos neutros, espacios en blanco
- **Tailwind**: `tw-bg-beige-100`, `tw-text-beige-700`
- **CSS Variable**: `var(--beige-100)`

## Ejemplos de Uso en Angular

### 1. Usando Clases de Tailwind con Prefijo

```html
<!-- Botón principal -->
<button class="tw-bg-emerald-green-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-emerald-green-600 tw-transition-all">
  Acción Principal
</button>

<!-- Botón secundario -->
<button class="tw-bg-coral-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-coral-600 tw-transition-all">
  Acción Secundaria
</button>

<!-- Card con gradiente -->
<div class="tw-bg-gradient-primary tw-p-6 tw-rounded-xl tw-shadow-soft">
  <h3 class="tw-text-white tw-text-xl tw-font-bold">Título de Card</h3>
  <p class="tw-text-white/90">Contenido de la tarjeta</p>
</div>
```

### 2. Usando CSS Variables en Componentes

```typescript
// component.ts
@Component({
  selector: 'app-example',
  template: `
    <div class="container">
      <h1>Mi Componente</h1>
      <button class="btn-primary">Botón Principal</button>
      <button class="btn-secondary">Botón Secundario</button>
    </div>
  `,
  styles: [`
    .container {
      background: var(--gradient-hero);
      padding: 2rem;
      border-radius: 1rem;
    }
    
    h1 {
      color: var(--emerald-700);
      margin-bottom: 1rem;
    }
  `]
})
export class ExampleComponent { }
```

### 3. Alertas y Notificaciones

```html
<!-- Alerta de éxito -->
<div class="alert-success">
  <strong>¡Éxito!</strong> La operación se completó correctamente.
</div>

<!-- Alerta de error -->
<div class="alert-error">
  <strong>Error:</strong> Hubo un problema al procesar la solicitud.
</div>

<!-- Alerta de información -->
<div class="alert-info">
  <strong>Info:</strong> Nueva funcionalidad disponible.
</div>
```

### 4. Gradientes Disponibles

```html
<!-- Gradiente principal -->
<div class="tw-bg-gradient-primary tw-h-32 tw-rounded-lg"></div>

<!-- Gradiente suave -->
<div class="tw-bg-gradient-soft tw-h-32 tw-rounded-lg"></div>

<!-- Gradiente cálido -->
<div class="tw-bg-gradient-warm tw-h-32 tw-rounded-lg"></div>

<!-- Gradiente hero -->
<div class="tw-bg-gradient-hero tw-h-64 tw-rounded-lg"></div>
```

### 5. Sombras Personalizadas

```html
<!-- Sombra suave -->
<div class="tw-shadow-soft tw-p-6 tw-bg-white tw-rounded-lg">
  Contenido con sombra suave
</div>

<!-- Sombra suave grande -->
<div class="tw-shadow-soft-lg tw-p-6 tw-bg-white tw-rounded-lg">
  Contenido con sombra pronunciada
</div>

<!-- Sombra cálida -->
<div class="tw-shadow-warm tw-p-6 tw-bg-white tw-rounded-lg">
  Contenido con sombra cálida
</div>
```

## Variaciones de Color Disponibles

Cada color tiene 9 variaciones (50-900), desde muy claro hasta muy oscuro:

- **50**: Muy claro (fondos, overlays)
- **100**: Claro (fondos secundarios)
- **200-300**: Claro medio (elementos interactivos ligeros)
- **400-500**: Principal (botones, enlaces principales)
- **600-700**: Medio oscuro (hover states, texto importante)
- **800-900**: Muy oscuro (texto, elementos de contraste)

## Mejores Prácticas

1. **Consistencia**: Usa siempre los mismos colores para acciones similares
2. **Contraste**: Asegúrate de que el texto sea legible sobre los fondos
3. **Jerarquía**: Usa emerald-green para acciones principales, coral para secundarias
4. **Accesibilidad**: Los colores 600+ tienen suficiente contraste para texto blanco
5. **Semantic**: Usa los colores semánticos (success, error, info) para estados específicos

## Migración de Colores Antiguos

| Color Antiguo | Nuevo Color Equivalente |
|---------------|------------------------|
| `primary` | `emerald-green-500` |
| `secondary` | `beige-700` |
| `accent` | `sky-blue-300` |
| `red-500` | `coral-500` |
| `success` | `emerald-green-500` |
| `info` | `sky-blue-300` |
