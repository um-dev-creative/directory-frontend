# Skeleton Loading - Guía de Implementación

## Descripción
Los Skeleton Loaders proporcionan una mejor experiencia de usuario durante los estados de carga, mostrando una vista previa de la estructura del contenido que se está cargando.

## Uso Básico

### 1. Import del Componente
```typescript
import { SkeletonComponent } from './components/ui';
```

### 2. Configuración en el Componente
```typescript
@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <!-- Skeleton mientras carga -->
    @if (isLoading) {
      <app-skeleton
        variant="card"
        [loading]="true"
        [showImage]="true"
        [imageHeight]="180"
        animation="pulse"
      ></app-skeleton>
    } @else {
      <!-- Contenido real -->
      <div class="business-card">...</div>
    }
  `
})
export class BusinessListComponent {
  isLoading = true;
  
  ngOnInit() {
    this.loadBusinesses().finally(() => {
      this.isLoading = false;
    });
  }
}
```

## Variantes Disponibles

### 1. Default - Líneas simples
```html
<app-skeleton
  variant="default"
  [loading]="true"
  [count]="3"
  [height]="16"
  animation="pulse"
></app-skeleton>
```

### 2. Card - Tarjeta con imagen
```html
<app-skeleton
  variant="card"
  [loading]="true"
  [showImage]="true"
  [imageHeight]="200"
  animation="pulse"
></app-skeleton>
```

### 3. List - Lista con avatares
```html
<app-skeleton
  variant="list"
  [loading]="true"
  [count]="5"
  [showAvatar]="true"
  [showAction]="true"
  [avatarSize]="48"
  animation="pulse"
></app-skeleton>
```

### 4. Profile - Perfil de usuario
```html
<app-skeleton
  variant="profile"
  [loading]="true"
  animation="pulse"
></app-skeleton>
```

### 5. Table - Tabla de datos
```html
<app-skeleton
  variant="table"
  [loading]="true"
  [tableColumns]="5"
  [tableRows]="8"
  animation="pulse"
></app-skeleton>
```

### 6. Custom - Personalizado con content projection
```html
<app-skeleton
  variant="custom"
  [loading]="true"
  animation="pulse"
>
  <div class="tw-space-y-4">
    <!-- Elementos personalizados -->
    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-6 tw-w-3/4"></div>
    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-circle tw-w-12 tw-h-12"></div>
    <div class="tw-skeleton-element tw-skeleton-pulse tw-skeleton-rounded tw-h-4 tw-w-full"></div>
  </div>
</app-skeleton>
```

## Animaciones

### Pulse (Recomendada)
- Animación suave de opacidad
- Accesible y no distrae
- Mejor para la mayoría de casos

```html
<app-skeleton animation="pulse" [loading]="true"></app-skeleton>
```

### None (Sin animación)
- Útil para reducir distracciones
- Mejor rendimiento en dispositivos lentos

```html
<app-skeleton animation="none" [loading]="true"></app-skeleton>
```

## Casos de Uso Específicos

### 1. Directorio de Empresas
```html
<!-- Lista de empresas -->
@if (loadingBusinesses) {
  <div class="tw-space-y-4">
    @for (i of [1,2,3,4,5,6]; track i) {
      <app-skeleton
        variant="card"
        [loading]="true"
        [showImage]="true"
        [imageHeight]="120"
      ></app-skeleton>
    }
  </div>
} @else {
  <div class="business-grid">
    @for (business of businesses; track business.id) {
      <business-card [business]="business"></business-card>
    }
  </div>
}
```

### 2. Dashboard del Usuario
```html
@if (loadingDashboard) {
  <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-4 tw-gap-6">
    <!-- Perfil -->
    <div class="lg:tw-col-span-1">
      <app-skeleton variant="profile" [loading]="true"></app-skeleton>
    </div>
    
    <!-- Contenido -->
    <div class="lg:tw-col-span-3 tw-space-y-6">
      <!-- Stats -->
      <div class="tw-grid tw-grid-cols-3 tw-gap-4">
        @for (i of [1,2,3]; track i) {
          <app-skeleton
            variant="default"
            [loading]="true"
            [count]="2"
            [height]="16"
          ></app-skeleton>
        }
      </div>
      
      <!-- Actividad -->
      <app-skeleton
        variant="list"
        [loading]="true"
        [count]="4"
        [showAvatar]="true"
      ></app-skeleton>
    </div>
  </div>
}
```

### 3. Tabla de Datos
```html
@if (loadingTable) {
  <app-skeleton
    variant="table"
    [loading]="true"
    [tableColumns]="6"
    [tableRows]="10"
  ></app-skeleton>
} @else {
  <table class="data-table">...</table>
}
```

## Mejores Prácticas

### 1. Duración del Loading
- Máximo 4-5 segundos
- Usa timeout para fallback

```typescript
ngOnInit() {
  this.isLoading = true;
  
  // Timeout de seguridad
  const timeout = setTimeout(() => {
    this.isLoading = false;
  }, 5000);
  
  this.loadData().finally(() => {
    this.isLoading = false;
    clearTimeout(timeout);
  });
}
```

### 2. Consistencia Visual
- Usa siempre los mismos colores de marca
- Mantén la animación 'pulse' por defecto
- Respeta las proporciones del contenido real

### 3. Accesibilidad
- El componente incluye aria-label automáticamente
- Usa role="status" para lectores de pantalla
- Evita animaciones muy rápidas o distractoras

### 4. Performance
- Usa trackBy en *ngFor para mejor rendimiento
- Considera lazy loading para listas grandes
- Prefiere 'none' animation en dispositivos lentos

```typescript
// Detectar dispositivo lento
get shouldUseAnimation(): boolean {
  return !this.isLowEndDevice();
}

private isLowEndDevice(): boolean {
  // Lógica para detectar dispositivos lentos
  return navigator.hardwareConcurrency < 4;
}
```

## Integración con LoadingService

```typescript
import { LoadingService } from './services/loading.service';

@Component({...})
export class MyComponent {
  constructor(private loadingService: LoadingService) {}
  
  async loadData() {
    this.loadingService.show();
    try {
      const data = await this.dataService.fetchData();
      // Procesar datos
    } finally {
      this.loadingService.hide();
    }
  }
}
```

## Configuración Global

```typescript
// app.config.ts
export const skeletonConfig = {
  defaultAnimation: 'pulse' as const,
  defaultColors: {
    background: 'tw-from-beige-200 tw-via-beige-300 tw-to-beige-200',
    pulse: 'tw-animate-pulse'
  }
};
```

## Troubleshooting

### Problema: Skeleton no se muestra
- Verifica que `[loading]="true"`
- Asegúrate de importar `SkeletonComponent`
- Revisa que las clases CSS estén disponibles

### Problema: Animación no funciona
- Verifica que Tailwind CSS esté configurado
- Asegúrate de que `animate-pulse` esté disponible
- Revisa la configuración de `animation` prop

### Problema: Estilos personalizados no aplican
- Usa las clases `tw-skeleton-*` proporcionadas
- Verifica que los estilos estén en el componente correcto
- Asegúrate de usar ViewEncapsulation si es necesario
