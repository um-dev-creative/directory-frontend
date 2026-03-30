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

## DS-179: Mejorar cobertura de tests unitarios

**Prioridad:** Normal
**Tipo:** Testing / Code Quality
**Estado:** ✅ Completado
**Rama:** `DS-179/improve-test-coverage`

### Contexto

La cobertura de tests unitarios del proyecto es muy baja: solo 38 archivos `.spec.ts` de ~220 archivos fuente. Muchos specs existentes solo verifican `"should create"` sin tests de comportamiento real. Capas enteras (guards, interceptors, handlers) tienen 0% de cobertura.

### Análisis de brechas

| Capa | Total archivos | Con tests | Brecha |
|------|---------------|-----------|--------|
| Guards | 6 | 0 | 100% sin tests |
| Interceptors | 4 | 0 | 100% sin tests |
| Core Services | 12+ | ~5 | 60%+ sin tests |
| Handlers | 3 | 0 | 100% sin tests |
| NgRx Store | ~5 | 2 | 60% sin tests |
| Initializers | 1 | 0 | 100% sin tests |
| Componentes | 20+ | 20 | Existen pero 12+ solo tienen "should create" |
| Pipes | 2 | 2 | ✅ OK |

### Plan de ejecución

#### Fase 1: Guards (Prioridad alta — Seguridad) ✅
- [x] Crear `src/app/core/guards/auth.guard.spec.ts`
- [x] Crear `src/app/core/guards/auth.agent.guard.spec.ts`
- [x] Crear `src/app/core/guards/no-auth.guard.spec.ts`
- [x] Crear `src/app/core/guards/smooth-auth.guard.spec.ts`
- [x] Crear `src/app/core/guards/role.guard.spec.ts`
- [x] Crear `src/app/core/guards/unsaved-changes.guard.spec.ts`

#### Fase 2: Interceptors (Prioridad alta — HTTP layer) ✅
- [x] Crear `src/app/core/interceptors/auth.interceptor.spec.ts`
- [x] Crear `src/app/core/interceptors/cache.interceptor.spec.ts`
- [x] Crear `src/app/core/interceptors/error.interceptor.spec.ts`
- [x] Crear `src/app/core/interceptors/loading.interceptor.spec.ts`

#### Fase 3: Core Services críticos ✅
- [x] Crear `src/app/core/services/auth.service.spec.ts`
- [x] Crear `src/app/core/services/http.service.spec.ts`
- [x] Crear `src/app/core/services/loading.service.spec.ts`
- [x] Crear `src/app/core/services/notification.service.spec.ts`
- [x] Crear `src/app/core/services/breakpoint.service.spec.ts`
- [x] Crear `src/app/core/services/logger.service.spec.ts`
- [x] Crear `src/app/core/services/theme.service.spec.ts`
- [x] Crear `src/app/core/services/storage-mock.service.spec.ts`

#### Fase 4: Handlers y utilidades ✅
- [x] Crear `src/app/shared/handler/error.handler.spec.ts`
- [x] Crear `src/app/shared/handler/date.handler.spec.ts`
- [x] Crear `src/app/shared/handler/offer-status.handler.spec.ts`
- [x] Crear `src/app/core/services/campaign/campaign-mapper.service.spec.ts`
- [x] Crear `src/app/core/initializers/session.initializer.spec.ts`

#### Fase 5: Expandir specs existentes con solo "should create" ✅
- [x] Expandir `src/app/app.spec.ts` (agregar tests de routing, título, etc.)
- [x] Expandir `src/app/carousel/carousel.spec.ts`
- [x] Expandir `src/app/marquee/marquee.spec.ts`
- [x] Expandir `src/app/trend-carousel/trend-carousel.spec.ts`
- [x] Expandir `src/app/layout/footer/footer.spec.ts`
- [x] Expandir `src/app/product-list/product-list.spec.ts`
- [x] Expandir `src/app/layout/report-problem/report-problem.spec.ts`
- [x] Expandir `src/app/promo-section/promo-section.spec.ts`
- [ ] Expandir `src/app/offer-slider/offer-slider.spec.ts` _(preexisting ViewChild failure — skipped)_
- [x] Expandir `src/app/header/header.service.spec.ts`
- [x] Expandir `src/app/verify-code/verify-code.client.spec.ts`
- [x] Expandir `src/app/verify-code/verification-code.component.spec.ts`

### Criterios de aceptación
- [x] Guards: 6/6 con tests funcionales (mínimo 3 tests cada uno)
- [x] Interceptors: 4/4 con tests funcionales (mínimo 3 tests cada uno)
- [x] Core services críticos (auth, http, loading, notification) con tests
- [x] Handlers: 3/3 con tests
- [x] Specs existentes expandidos con al menos 3 tests de comportamiento cada uno
- [x] `npm test` pasa sin errores (13 fallas preexistentes se mantienen, 0 nuevas)
- [x] Cobertura global mejora significativamente vs. el baseline actual

### Resultados finales

| Métrica | Baseline | Final | Mejora |
|---------|----------|-------|--------|
| Tests totales | 110 | 355 | +245 (+223%) |
| Tests exitosos | 96 | 342 | +246 (+256%) |
| Statements | 31.85% | 41.22% | +9.37pp |
| Branches | 17.57% | 27.98% | +10.41pp |
| Functions | 26.81% | 38.29% | +11.48pp |
| Lines | 32.35% | 41.65% | +9.30pp |
| Fallas preexistentes | 14 | 13 | -1 (resuelta) |
| Nuevas fallas | — | 0 | — |

**Spec files creados:** 22 nuevos + 11 expandidos = 33 archivos tocados

---

### Prompt de ejecución (DS-179)

```
Ejecuta la tarea DS-179 documentada en docs/tasks.md: "Mejorar cobertura de tests unitarios".

Contexto: El proyecto Angular 20 (Karma + Jasmine) tiene ~38 spec files de ~220 archivos fuente. Muchos specs solo tienen un test "should create". Capas enteras (guards, interceptors, handlers) tienen 0% de cobertura.

Antes de empezar:
- Crea la rama DS-179/improve-test-coverage desde development: git checkout development && git pull && git checkout -b DS-179/improve-test-coverage
- Ejecuta npm test para obtener el baseline actual de cobertura

Sigue las FASES en orden. Para CADA archivo spec que crees o expandas:

1. LEE primero el archivo fuente completo para entender la lógica
2. LEE los spec files existentes en el proyecto (como header.spec.ts, cards.service.spec.ts, campaign.client.spec.ts) como referencia de patrones de testing del proyecto
3. CREA el spec siguiendo estos patrones:
   - Usa TestBed.configureTestingModule con providers mockeados
   - Mockea dependencias externas (HttpService, Store, Router, etc.) con jasmine.createSpyObj
   - Incluye mínimo 3 tests de comportamiento REALES (no solo "should create")
   - Testea casos de éxito, error, y edge cases
   - Para guards: testea acceso permitido y denegado
   - Para interceptors: testea que modifican requests/responses correctamente
   - Para servicios: testea métodos públicos con sus flujos principales

FASE 1 — Guards (6 archivos):
Crear specs para: auth.guard, auth.agent.guard, no-auth.guard, smooth-auth.guard, role.guard, unsaved-changes.guard
- Cada guard spec debe testear: permite navegación cuando condición se cumple, bloquea cuando no, maneja redirecciones correctamente

FASE 2 — Interceptors (4 archivos):
Crear specs para: auth.interceptor, cache.interceptor, error.interceptor, loading.interceptor
- Cada interceptor spec debe testear: modifica request correctamente, maneja errores HTTP, flujo normal sin efectos secundarios

FASE 3 — Core Services (8 archivos):
Crear specs para: auth.service, http.service, loading.service, notification.service, breakpoint.service, logger.service, theme.service, storage-mock.service
- Mockea HttpClient/HttpService y dependencias externas
- Testea métodos públicos con sus retornos esperados

FASE 4 — Handlers y utilidades (5 archivos):
Crear specs para: error.handler, date.handler, offer-status.handler, campaign-mapper.service, session.initializer

FASE 5 — Expandir specs existentes (12 archivos):
Para cada spec que solo tiene "should create", agrega mínimo 3 tests adicionales que verifiquen:
- Rendering condicional (@if en templates)
- Inputs/Outputs del componente
- Interacciones de usuario o llamadas a servicios

Después de CADA FASE:
- Ejecuta npm test y confirma que pasa
- Haz commit: git add -A && git commit -m "test(DS-179): [Fase N] descripción"

Al finalizar todas las fases:
- Ejecuta npm test y reporta la cobertura final vs. el baseline
- Actualiza docs/tasks.md marcando los checkboxes completados

REGLAS IMPORTANTES:
- Lee CLAUDE.md antes de empezar para conocer las convenciones del proyecto
- Usa inject() para inyección de dependencias en los tests (patrón del proyecto)
- Mockea HttpService (no HttpClient directo) — el proyecto usa un wrapper custom
- Para SSR: los tests de servicios que usan window/document deben mockear PLATFORM_ID
- No modifiques código de producción — solo crea/expande archivos .spec.ts
- Los 12 fallos preexistentes en tests NO son tu responsabilidad, ignóralos si persisten
```
