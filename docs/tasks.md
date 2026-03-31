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
Tarea: ds-189

**Tipo:** Task / Security
**Prioridad:** Critical
**Tags:** `security` `angular` `npm-audit` `tech-debt` `dependencies`

---

## Descripción

Al ejecutar `npm install` en el proyecto `directory-frontend` (Angular 20 + SSR), se detectaron **48 vulnerabilidades** en el árbol de dependencias:

| Severidad | Cantidad |
|-----------|----------|
| 🔴 Critical | 3 |
| 🟠 High | 31 |
| 🟡 Moderate | 13 |
| 🔵 Low | 1 |
| **Total** | **48** |

---

## Vulnerabilidades por grupo

### 🔴 Critical

| Paquete | Advisory | Descripción |
|---------|----------|-------------|
| `@angular/ssr` | GHSA-x288-3778-4hhx | SSRF + Header Injection via request pipeline |
| `@angular/ssr` | GHSA-xh43-g2fq-wjrj | Open Redirect via X-Forwarded-Prefix |
| `@angular/ssr` | GHSA-vfx2-hv2g-xj5f | Protocol-Relative URL Injection via backslash |
| `form-data` (en `request`) | GHSA-fjxv-7rqg-78g4 | Función random insegura para boundary — **sin fix disponible** |

### 🟠 High

| Paquete | Problema principal |
|---------|-------------------|
| `@angular/compiler` + árbol `@angular/*` | XSS en i18n attribute bindings |
| `hono` | Cookie injection, SSE injection, file access, prototype pollution |
| `@hono/node-server` | Auth bypass en Serve Static Middleware |
| `serialize-javascript` | RCE via RegExp + DoS (afecta `copy-webpack-plugin`, `terser-webpack-plugin`) |
| `node-forge` | Bypass de cert chain, signature forgery en RSA y Ed25519 |
| `multer` | DoS via recursión y resource exhaustion (3 CVEs) |
| `rollup` | Arbitrary File Write via path traversal |
| `tar` | Arbitrary File Write/Read, symlink poisoning — **fix requiere `bcrypt@6.0.0` (breaking change)** |
| `path-to-regexp` | ReDoS via wildcards y grupos opcionales |
| `socket.io-parser` | Unbounded binary attachments |
| `fast-xml-parser` | Stack overflow + entity expansion bypass |
| `flatted` | Prototype Pollution + DoS via recursión |
| `minimatch` / `picomatch` / `brace-expansion` | ReDoS múltiples variantes |
| `immutable` | Prototype Pollution |
| `express-rate-limit` | Bypass de rate limiting via IPv4-mapped IPv6 |

### 🟡 Sin fix disponible — requieren intervención manual

| Paquete | Problema | Acción requerida |
|---------|----------|-----------------|
| `request` / `request-promise` / `node-vault-client` | Dependen de `form-data`, `qs` y `tough-cookie` vulnerables. `request` está **deprecado** | Identificar usos y reemplazar con `axios` o `fetch` nativo |
| `qs < 6.14.1` | DoS via memory exhaustion (dentro de `request`) | Bloqueado por upstream |
| `tough-cookie < 4.1.3` | Prototype Pollution | Bloqueado por upstream |

---

## Estrategia de resolución

### Fase 1 — Fix seguro automático
- [ ] Ejecutar `npm audit fix` (sin `--force`)
- [ ] Verificar build: `ng build`
- [ ] Correr suite de tests: `ng test --watch=false`

### Fase 2 — Confirmar fixes del Grupo A
- [ ] Verificar que quedaron resueltos: Angular, hono, multer, rollup, serialize-javascript, node-forge, path-to-regexp, socket.io-parser, flatted, fast-xml-parser, minimatch, picomatch, brace-expansion, immutable, express-rate-limit

### Fase 3 — Breaking change: `tar` → `bcrypt@6.0.0`
- [ ] Revisar changelog de bcrypt v6 para confirmar compatibilidad de API (`hash`, `compare`, `genSalt`)
- [ ] Si API compatible: ejecutar `npm install bcrypt@6.0.0` y correr tests
- [ ] Si API cambió: documentar los cambios necesarios antes de aplicar
- [ ] Hacer en branch separada con PR propio

### Fase 4 — Reemplazo de `request` / `node-vault-client`
- [ ] Buscar todos los usos de `request`, `request-promise`, `node-vault-client` en el codebase
- [ ] Proponer implementación de reemplazo con `axios` o `fetch` nativo por cada uso
- [ ] Implementar y validar con tests
- [ ] Remover dependencias deprecadas del `package.json`

### Fase 5 — Validación final y prevención
- [ ] `npm audit --audit-level=high` debe salir con código 0
- [ ] `ng build` debe completar sin errores
- [ ] Agregar `npm audit --audit-level=high` como step de bloqueo en CI/CD
- [ ] Actualizar `CLAUDE.md` con política de dependencias (ver sección abajo)

---

## Criterios de aceptación

- [ ] Cero vulnerabilidades `critical`
- [ ] Cero vulnerabilidades `high`
- [ ] `ng build` pasa sin errores
- [ ] Suite de tests pasa completa
- [ ] CI/CD incluye `npm audit --audit-level=high` como step de bloqueo
- [ ] `CLAUDE.md` actualizado con política documentada

---

## Riesgos aceptados explícitamente

| Paquete | CVE | Motivo | Fecha | Responsable |
|---------|-----|--------|-------|-------------|
| `qs` (via `request`) | GHSA-6rw7-vpxm-498p | Sin fix upstream, bloqueado por deprecación de `request` | 2025-Q2 | (asignar) |
| `tough-cookie` | GHSA-72xf-g2v4-qvf3 | Sin fix upstream, bloqueado por deprecación de `request` | 2025-Q2 | (asignar) |

---

## Sección para `.claude/CLAUDE.md`
```markdown
## Dependency Security Policy

### Rules
- Run `npm audit` before every PR that touches dependencies
- Zero tolerance for `critical` or `high` vulnerabilities at merge time
- Use `npm ci` in CI/CD instead of `npm install`
- Never run `npm audit fix --force` without a separate branch and full test pass

### Adding dependencies
- Check last release date (must be < 12 months ago)
- Verify at https://socket.dev before adding
- Prefer packages with minimal transitive dependencies
- The `request` package is BANNED — use native fetch or axios instead

### Known accepted risks
| Package | CVE | Reason accepted | Date | Owner |
|---------|-----|-----------------|------|-------|
| qs (via request) | GHSA-6rw7-vpxm-498p | No upstream fix, blocked by request deprecation | 2025-Q2 | (asignar) |
| tough-cookie | GHSA-72xf-g2v4-qvf3 | No upstream fix, blocked by request deprecation | 2025-Q2 | (asignar) |

### CI enforcement
Add to pipeline:
```
npm audit --audit-level=high
```
```

---

## Notas

- La cadena `request` → `node-vault-client` es la más compleja: no tiene fix automático y requiere refactor manual. Priorizar en Fase 4.
- El breaking change de `bcrypt@6.0.0` debe ir en branch y PR separados.
- `qs` y `tough-cookie` quedan como riesgo aceptado hasta que `request` sea eliminado del proyecto.
