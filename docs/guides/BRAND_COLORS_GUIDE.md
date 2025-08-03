# Guía de Uso de Colores de Marca

## Sistema de Colores Moderno

Este proyecto utiliza un **sistema de colores RGB moderno** que permite máxima flexibilidad con transparencias dinámicas y mantiene compatibilidad con Tailwind CSS.

### � Arquitectura del Sistema

- **Variables RGB**: Base del sistema para transparencias (`--color-primary: 46 139 87`)
- **Clases Tailwind**: Para casos comunes (`tw-bg-emerald-green-500`)
- **Clases Brand**: Para casos específicos con transparencias (`bg-brand-primary-10`)
- **CSS Variables**: Para casos avanzados (`var(--emerald-500)`)

## Paleta de Colores de Marca

### 🌿 Emerald Green (Color Primario)
- **RGB**: `46 139 87` 
- **Hex**: `#2E8B57`
- **Uso**: Botones principales, enlaces importantes, headers, elementos de marca
- **Tailwind**: `tw-bg-emerald-green-500`, `tw-text-emerald-green-500`
- **CSS Variable**: `var(--emerald-500)` o `rgb(var(--color-primary))`
- **Clases Brand**: `bg-brand-primary-10`, `text-brand-primary`

### 🪸 Coral (Color Secundario)
- **RGB**: `255 111 97`
- **Hex**: `#FF6F61`
- **Uso**: Botones secundarios, alertas de error, call-to-action
- **Tailwind**: `tw-bg-coral-500`, `tw-text-coral-500`
- **CSS Variable**: `var(--coral-500)` o `rgb(var(--color-secondary))`
- **Clases Brand**: `bg-brand-secondary-10`, `text-brand-secondary`

### 🌤️ Sky Blue (Color de Acento)
- **RGB**: `135 206 235`
- **Hex**: `#87CEEB`
- **Uso**: Información, notificaciones, elementos informativos
- **Tailwind**: `tw-bg-sky-blue-300`, `tw-text-sky-blue-300`
- **CSS Variable**: `var(--sky-300)`

### 🏔️ Beige (Color Neutral)
- **RGB**: `245 245 220`
- **Hex**: `#F5F5DC`
- **Uso**: Fondos, elementos neutros, espacios en blanco
- **Tailwind**: `tw-bg-beige-100`, `tw-text-beige-700`
- **CSS Variable**: `var(--beige-100)`

## Clases de Utilidad Brand (Nuevas)

### 🎯 Backgrounds con Transparencias
```html
<!-- Transparencias del color primario -->
<div class="bg-brand-primary-10">Fondo con 10% de opacidad</div>
<div class="bg-brand-primary-20">Fondo con 20% de opacidad</div>
<div class="bg-brand-primary-30">Fondo con 30% de opacidad</div>
<div class="bg-brand-primary-light">Fondo claro (equivale a 10%)</div>

<!-- Transparencias del color secundario -->
<div class="bg-brand-secondary-10">Fondo coral con 10% de opacidad</div>
<div class="bg-brand-secondary-20">Fondo coral con 20% de opacidad</div>
<div class="bg-brand-secondary-30">Fondo coral con 30% de opacidad</div>
```

### 🎨 Colores de Texto
```html
<p class="text-brand-primary">Texto en color primario</p>
<p class="text-brand-primary-dark">Texto en color primario oscuro</p>
<p class="text-brand-secondary">Texto en color secundario</p>
```

### 🔲 Bordes
```html
<div class="border-brand-primary">Borde color primario</div>
<div class="border-brand-primary-200">Borde color primario con transparencia</div>
<div class="border-brand-secondary">Borde color secundario</div>
```

## Ejemplos de Uso en Angular

### 1. Usando Clases de Tailwind con Prefijo

```html
<!-- Botón principal con hover -->
<button class="tw-bg-emerald-green-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-emerald-green-600 tw-transition-all">
  Acción Principal
</button>

<!-- Botón secundario con hover -->
<button class="tw-bg-coral-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold hover:tw-bg-coral-600 tw-transition-all">
  Acción Secundaria
</button>

<!-- Card con gradiente -->
<div class="tw-bg-gradient-primary tw-p-6 tw-rounded-xl tw-shadow-soft">
  <h3 class="tw-text-white tw-text-xl tw-font-bold">Título de Card</h3>
  <p class="tw-text-white/90">Contenido de la tarjeta</p>
</div>

<!-- Alert con clases brand -->
<div class="bg-brand-primary-10 border-brand-primary tw-border tw-rounded-lg tw-p-4">
  <h5 class="text-brand-primary tw-font-medium tw-mb-2">Información</h5>
  <p class="text-brand-primary tw-text-sm">Mensaje usando el sistema de colores RGB.</p>
</div>
```

### 2. Usando Sistema RGB Moderno

```typescript
// component.ts - Aprovechando el sistema RGB
@Component({
  selector: 'app-modern-example',
  template: `
    <div class="container">
      <h1 class="title">Mi Componente Moderno</h1>
      <button class="btn-primary">Botón Principal</button>
      <button class="btn-secondary">Botón Secundario</button>
      <div class="notification">
        <p>Notificación con transparencia dinámica</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      background: var(--gradient-hero);
      padding: 2rem;
      border-radius: 1rem;
    }
    
    .title {
      color: rgb(var(--color-primary));
      margin-bottom: 1rem;
    }
    
    .notification {
      background-color: rgb(var(--color-primary) / 0.1);
      border: 1px solid rgb(var(--color-primary) / 0.2);
      border-radius: 0.75rem;
      padding: 1rem;
      color: rgb(var(--color-primary));
    }
  `]
})
export class ModernExampleComponent { }
```

### 3. Usando CSS Variables Tradicionales (Compatibilidad)

```typescript
// component.ts - Para compatibilidad con sistema anterior
@Component({
  selector: 'app-legacy-example',
  template: `
    <div class="container">
      <h1>Mi Componente Tradicional</h1>
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
export class LegacyExampleComponent { }
```

### 4. Componentes Predefinidos

```html
<!-- Botones con estilos predefinidos -->
<button class="btn-primary">Botón Principal</button>
<button class="btn-secondary">Botón Secundario</button>
<button class="btn-outline">Botón Outline</button>

<!-- Cards con estilos predefinidos -->
<div class="card-brand">
  <h3>Card con Gradient</h3>
  <p>Esta card usa el gradient suave de marca con sombra personalizada.</p>
</div>
```

### 5. Alertas y Notificaciones

```html
<!-- Alertas con estilos predefinidos -->
<div class="alert-success">
  <strong>¡Éxito!</strong> La operación se completó correctamente.
</div>

<div class="alert-error">
  <strong>Error:</strong> Hubo un problema al procesar la solicitud.
</div>

<div class="alert-info">
  <strong>Info:</strong> Nueva funcionalidad disponible.
</div>

<!-- Alertas personalizadas con sistema RGB -->
<div class="bg-brand-primary-10 border-brand-primary tw-border tw-rounded-lg tw-p-4">
  <strong class="text-brand-primary">Personalizada:</strong>
  <span class="text-brand-primary">Alerta usando sistema RGB moderno.</span>
</div>
```

### 6. Gradientes Disponibles

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

### 7. Sombras Personalizadas

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

### Sistema Tailwind (Recomendado)
Cada color tiene 9 variaciones (50-900), desde muy claro hasta muy oscuro:

- **50**: Muy claro (fondos, overlays) - `tw-bg-emerald-green-50`
- **100**: Claro (fondos secundarios) - `tw-bg-emerald-green-100`
- **200-300**: Claro medio (elementos interactivos ligeros) - `tw-bg-emerald-green-300`
- **400-500**: Principal (botones, enlaces principales) - `tw-bg-emerald-green-500` ⭐
- **600-700**: Medio oscuro (hover states, texto importante) - `tw-bg-emerald-green-700`
- **800-900**: Muy oscuro (texto, elementos de contraste) - `tw-bg-emerald-green-900`

### Sistema RGB Brand (Para Transparencias)
Usa el sistema RGB para transparencias dinámicas:

```css
/* Ejemplos de uso directo */
background-color: rgb(var(--color-primary) / 0.1);    /* 10% transparencia */
background-color: rgb(var(--color-primary) / 0.2);    /* 20% transparencia */
background-color: rgb(var(--color-primary) / 0.5);    /* 50% transparencia */

/* O usando las clases de utilidad */
.bg-brand-primary-10    /* 10% transparencia */
.bg-brand-primary-20    /* 20% transparencia */
.bg-brand-primary-30    /* 30% transparencia */
```

## Referencia Rápida de Variables

### Variables RGB (Sistema Moderno)
```css
--color-primary: 46 139 87;          /* Emerald Green */
--color-primary-dark: 21 128 61;     /* Emerald Green Dark */
--color-secondary: 255 111 97;       /* Coral */
--color-accent: 135 206 235;         /* Sky Blue */
--color-neutral: 245 245 220;        /* Beige */
```

### Variables CSS Tradicionales (Compatibilidad)
```css
--emerald-500: #2E8B57;
--coral-500: #FF6F61;
--sky-300: #87CEEB;
--beige-100: #F5F5DC;
```

## Mejores Prácticas

### 🎯 Selección de Colores
1. **Consistencia**: Usa siempre los mismos colores para acciones similares
2. **Jerarquía Visual**: 
   - Emerald Green (`tw-bg-emerald-green-500`) para acciones principales
   - Coral (`tw-bg-coral-500`) para acciones secundarias
   - Sky Blue (`tw-bg-sky-blue-300`) para información
3. **Contraste**: Los colores 600+ tienen suficiente contraste para texto blanco
4. **Accesibilidad**: Siempre verifica el contraste según WCAG 2.1

### 🚀 Uso del Sistema RGB
1. **Transparencias**: Usa `rgb(var(--color-primary) / 0.1)` para overlays
2. **Hover States**: Incrementa la opacidad para efectos hover
3. **Borders**: Usa transparencias para borders sutiles
4. **Gradientes**: Combina colores RGB para gradientes dinámicos

### 📱 Responsive y Performance
1. **Clases Tailwind**: Prefiere `tw-bg-emerald-green-500` para mejor performance
2. **CSS Variables**: Usa para casos específicos donde necesites flexibilidad
3. **Clases Brand**: Úsalas cuando necesites transparencias específicas

### 🔄 Migración y Mantenimiento
1. **Gradual**: Migra componente por componente al nuevo sistema
2. **Testing**: Verifica que todos los colores se muestren correctamente
3. **Documentación**: Mantén actualizada esta guía cuando agregues nuevos colores

## Migración de Colores Antiguos

| Color Antiguo | Nuevo Sistema RGB | Clases Tailwind | Clases Brand |
|---------------|-------------------|-----------------|--------------|
| `primary` | `rgb(var(--color-primary))` | `tw-bg-emerald-green-500` | `bg-brand-primary-*` |
| `secondary` | `rgb(var(--color-secondary))` | `tw-bg-coral-500` | `bg-brand-secondary-*` |
| `accent` | `var(--sky-300)` | `tw-bg-sky-blue-300` | - |
| `neutral` | `var(--beige-100)` | `tw-bg-beige-100` | - |
| `red-500` | `rgb(var(--color-secondary))` | `tw-bg-coral-500` | `bg-brand-secondary-*` |
| `success` | `rgb(var(--color-primary))` | `tw-bg-emerald-green-500` | `bg-brand-primary-*` |
| `info` | `var(--sky-300)` | `tw-bg-sky-blue-300` | - |

## Herramientas de Desarrollo

### 🎨 Color Showcase
Ve ejemplos en vivo en el componente `colors-section.component.ts`:
- Paletas completas con todas las variaciones
- Ejemplos de gradientes y sombras
- Demos de transparencias y clases brand
- Ejemplos de componentes (botones, cards, alertas)

### 🔧 Debugging
```typescript
// Para verificar valores RGB en el navegador
console.log(getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
// Output: "46 139 87"

// Para verificar variables CSS tradicionales
console.log(getComputedStyle(document.documentElement).getPropertyValue('--emerald-500'));
// Output: "#2E8B57"
```

### 📋 Checklist de Implementación
- [ ] Importar `brand-colors.css` en el componente
- [ ] Verificar que las clases Tailwind funcionen (`tw-bg-emerald-green-500`)
- [ ] Probar clases brand si usas transparencias (`bg-brand-primary-10`)
- [ ] Validar contraste de colores (WCAG 2.1)
- [ ] Comprobar funcionamiento en modo oscuro (si aplica)

---

> **Nota**: Este sistema está diseñado para ser flexible y escalable. Si necesitas agregar nuevos colores o variaciones, sigue el patrón RGB establecido en `brand-colors.css`.
