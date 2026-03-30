# Directory Frontend Improvement Tasks

## Security Improvements
1. [ ] Fix NODE_TLS_REJECT_UNAUTHORIZED=0 in server.js which disables SSL certificate validation
2. [ ] Implement proper CSRF protection for API endpoints
3. [ ] Review and update Content Security Policy
4. [ ] Implement proper input validation for all user inputs
5. [ ] Audit and update dependencies with known vulnerabilities
6. [ ] Implement proper error handling that doesn't expose sensitive information
7. [ ] Review and improve authentication mechanisms
8. [ ] Add rate limiting for authentication endpoints specifically

## Performance Improvements
1. [ ] Implement lazy loading for all feature modules
2. [ ] Optimize bundle sizes with code splitting
3. [ ] Implement virtual scrolling for large lists (product-list, carousel components)
4. [ ] Add service worker for caching and offline support
5. [ ] Optimize images and implement responsive images
6. [ ] Implement preloading strategies for critical resources
7. [ ] Review and optimize CSS (remove unused styles)
8. [ ] Implement proper caching strategies for API responses

## Code Quality Improvements
1. [ ] Implement consistent error handling strategy across the application
2. [ ] Add comprehensive unit tests for all components and services
3. [ ] Add end-to-end tests for critical user flows
4. [ ] Implement stricter TypeScript configurations
5. [ ] Add ESLint and Prettier for code style consistency
6. [ ] Refactor components to follow Angular best practices
7. [ ] Implement proper logging strategy
8. [ ] Add documentation for all public APIs and components

## Architecture Improvements
1. [ ] Refactor state management to use NgRx consistently across the application
2. [ ] Implement feature-based folder structure
3. [ ] Create proper abstraction layers for API communication
4. [ ] Implement proper dependency injection patterns
5. [ ] Separate business logic from UI components
6. [ ] Create reusable UI component library
7. [ ] Implement proper configuration management
8. [ ] Refactor server-side code to use TypeScript

## DevOps Improvements
1. [ ] Set up CI/CD pipeline
2. [ ] Implement automated testing in the pipeline
3. [ ] Add code quality gates (SonarQube, etc.)
4. [ ] Implement proper environment configuration
5. [ ] Set up monitoring and alerting
6. [ ] Implement proper logging and error tracking
7. [ ] Create Docker containers for development and production
8. [ ] Implement infrastructure as code

## User Experience Improvements
1. [ ] Implement proper loading indicators
2. [ ] Add proper error messages for users
3. [ ] Implement form validation with helpful error messages
4. [ ] Improve accessibility (ARIA attributes, keyboard navigation, etc.)
5. [ ] Implement responsive design for all components
6. [ ] Add proper animations for transitions
7. [ ] Implement proper internationalization
8. [ ] Add user feedback mechanisms

## Documentation Improvements
1. [ ] Create comprehensive README with setup instructions
2. [ ] Document architecture decisions
3. [ ] Create API documentation
4. [ ] Document component usage with examples
5. [ ] Create user documentation
6. [ ] Document testing strategy
7. [ ] Create contribution guidelines
8. [ ] Document deployment process

## Specific Component Improvements
1. [ ] Refactor carousel component to improve performance
2. [ ] Enhance authentication flow with proper error handling
3. [ ] Improve form validation in user registration
4. [ ] Optimize banner component for better performance
5. [ ] Enhance product-list with filtering and sorting capabilities
6. [ ] Improve search functionality with typeahead
7. [ ] Enhance header component with responsive design
8. [ ] Improve footer with better organization of links

---

## DS-178: Eliminar Angular Material del proyecto

**Prioridad:** Media
**Tipo:** Refactor / Cleanup
**Estado:** ✅ Completado

### Contexto

El proyecto tenía `@angular/material` y `@angular/cdk` instalados como dependencias de producción. `@angular/material` no se usaba en ningún componente de producción (solo en demos). `@angular/cdk` sí se usa activamente a través de `BreakpointObserver` de `@angular/cdk/layout` en `header.ts` y `offer-slider.client.ts`.

### Hallazgos del análisis

| Elemento | Estado |
|----------|--------|
| `@angular/material` en package.json | Instalado (^20.2.7) — **no usado en producción** |
| `@angular/cdk` en package.json | Instalado (^20.2.7) — **usado activamente** (`BreakpointObserver`) |
| `src/app/shared/material/material.module.ts` | Define 23 módulos Material — **nunca importado por ningún componente** |
| Componentes `mat-*` en templates de producción | **0 usos** |
| `core-demo.component.ts` | Único archivo que usa `MatCardModule` y `MatButtonModule` — **es solo un demo** |
| Tema Azure Blue en angular.json | Configurado pero no aprovechado |
| `@angular/cdk/layout` (BreakpointObserver) | Usado en 2 archivos: `header.ts` y `offer-slider.client.ts` — **se mantiene** |
| NotificationService | Ya usa implementación custom (sin MatSnackBar) |
| Diálogos | Ya usan implementación custom (sin MatDialog) |

### Decisión sobre `@angular/cdk`

Se decidió **mantener `@angular/cdk`** como dependencia porque:
- CDK es una librería independiente de Material, no es peso muerto de UI
- `BreakpointObserver` es una utilidad robusta y bien mantenida para responsive design
- Reemplazarlo con `window.matchMedia()` nativo no aporta valor significativo y agrega código custom que mantener

### Plan de ejecución

#### Paso 1: Eliminar archivos de Material
- [x] Eliminar `src/app/shared/material/material.module.ts` (y su directorio)
- [x] Eliminar `src/app/core-demo.component.ts` (componente demo no usado en producción)
- [x] Eliminar `src/app/example-usage.component.ts` (demo de Material)
- [x] Verificar que no quedan imports huérfanos a estos archivos

#### Paso 2: Limpiar configuración del tema
- [x] Remover `@angular/material/prebuilt-themes/azure-blue.css` de `angular.json` (build styles)
- [x] Remover `@angular/material/prebuilt-themes/rose-red.css` de `angular.json` (test styles)

#### Paso 3: Desinstalar `@angular/material` (solo Material, no CDK)
- [x] `npm uninstall @angular/material`

#### Paso 4: Limpieza y verificación
- [x] Ejecutar `ng build` para verificar que compila sin errores
- [x] Ejecutar `ng test --no-watch --browsers ChromeHeadlessNoSandbox` para verificar tests
- [x] Buscar cualquier referencia residual a `@angular/material` en el código
- [x] Actualizar `CLAUDE.md` para remover mención del tema Azure Blue de Material

### Criterios de aceptación
- [x] Cero imports de `@angular/material` en todo el proyecto
- [x] `@angular/material` no aparece en `package.json`
- [x] `@angular/cdk` se mantiene en `package.json` (usado por `BreakpointObserver`)
- [x] Build de producción compila sin errores
- [x] Tests pasan sin errores (12 fallos preexistentes no relacionados con Material)
- [x] Los breakpoints responsivos de `header` y `offer-slider` siguen funcionando con CDK
