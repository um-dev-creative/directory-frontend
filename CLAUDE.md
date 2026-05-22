# CLAUDE.md — Directory Frontend

Guía de trabajo para Claude Code en este repositorio. Lee este archivo antes de tocar cualquier código.

---

## Stack tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Angular 20.3.3 con SSR (`@angular/ssr`) |
| Estado global | NgRx 20 (Store, Effects, Devtools) |
| Estado local | Signals de Angular (solo en componentes) |
| Estilos | Tailwind CSS v4 |
| Traducciones | `@ngx-translate/core` v16 — idioma por defecto: `es` |
| BFF | Express.js en `server/` — intermediario obligatorio hacia el backend Java |
| Sesión | Redis + fallback en memoria (`server/shared/redis-session-store.js`) |
| Autenticación | JWT + OAuth/Keycloak |
| Testing | Karma + Jasmine + ChromeHeadlessNoSandbox |
| TypeScript | 5.7.3 en modo `strict` |

---

## Aliases de rutas (tsconfig.json)

```
@app/*    → src/app/*
@core/*   → src/app/core/*
@shared/* → src/app/shared/*
@env/*    → src/environments/*
assets/*  → src/assets/*
```

Usa siempre estos aliases; nunca rutas relativas que suban más de dos niveles.

---

## Reglas absolutas (no negociables)

### Componentes

- **Siempre `standalone: true`** — no uses NgModule bajo ninguna circunstancia.
- La inyección de dependencias se hace con la función `inject()`, no con el constructor (salvo herencia que lo requiera).
- Usa **`@if` / `@for` / `@let`** del nuevo control flow — nunca `*ngIf` / `*ngFor` / `*ngSwitch`.
- Usa `| translate` de ngx-translate para textos visibles al usuario cuando la clave ya exista en los archivos i18n. Para strings nuevos o de prototipado rápido está bien dejarlos en duro temporalmente, pero añade un comentario `// TODO: i18n` para revisarlo después.
- Importa explícitamente en el array `imports: []` del decorador todo lo que el template necesite.

### Estado

- **NgRx** para estado global (store, actions, reducers, effects, selectors).
- **Signals** de Angular únicamente para estado local interno del componente.
- Estructura de feature store: `state.ts`, `actions.ts`, `reducer.ts`, `effects.ts`, `selectors.ts`, `store.service.ts`.
- Convención de nombre de acción: `[Feature] Verbo sustantivo` (ej. `[Session] Save session`).

### HTTP / BFF

- **Nunca llames directamente al backend Java** desde el código Angular. Toda llamada HTTP pasa por el BFF en `server/`.
- En Angular usa `HttpService` (`@core/services/http.service.ts`) — nunca `HttpClient` directamente.
- Las URLs se construyen a partir de constantes en `DFC` (directorio de constantes) o de `environment.ts`. Cero URLs hardcodeadas.

### SSR

- Cualquier uso de `window`, `document`, `localStorage` o `sessionStorage` debe ir protegido con `isPlatformBrowser()` o usar `StorageMockService`.
- Marca con un comentario `// SSR: browser-only` cualquier código que detectes que no es compatible con SSR e indícalo al desarrollador.

### Archivos intocables

Nunca modifiques ni elimines:

```
ssl/
dist/
Dockerfile
docker-entrypoint.sh
server/config/app.config.js   ← Vault / secrets
```

---

## Convenciones de código

### Componentes — plantilla mínima

```typescript
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.css']
})
export class MiComponenteComponent {
  private readonly miServicio = inject(MiServicio);
}
```

### Template — control flow moderno

```html
@if (condicion) {
  <p>{{ 'clave.traduccion' | translate }}</p>
}

@for (item of items(); track item.id) {
  <app-item [data]="item" />
}

@let valor = signal$ | async;
```

### Servicios

```typescript
@Injectable({ providedIn: 'root' })
export class MiServicio {
  private readonly http = inject(HttpService);
  // ...
}
```

### NgRx — acciones

```typescript
export const cargarDatos = createAction('[Feature] Cargar datos');
export const cargarDatosExitoso = createAction(
  '[Feature] Cargar datos exitoso',
  props<{ datos: MiModelo[] }>()
);
export const cargarDatosFallido = createAction(
  '[Feature] Cargar datos fallido',
  props<{ error: string }>()
);
```

---

## Estructura de directorios relevante

```
src/app/
├── core/
│   ├── guards/          # Guardias de ruta
│   ├── interceptors/    # Interceptores HTTP
│   ├── services/        # Servicios core (auth, http, logger, notification…)
│   └── store/           # NgRx stores (session, …)
├── features/            # Módulos de feature con lazy loading
│   ├── auth/
│   ├── partner/
│   └── community-member/
├── components/
│   └── ui/              # Componentes UI reutilizables (Button, Badge, Card…)
├── layout/              # Footer, NotFound, ReportProblem
├── shared/              # Modelos, pipes, constantes compartidas
└── header/

server/                  # BFF Express.js
├── config/
├── controller/
├── routes/
├── proxy/
└── shared/

src/environments/        # Variables de entorno por ambiente
```

---

## Testing

```bash
# Comando estándar (siempre usar este)
ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox

# Con navegador interactivo (solo desarrollo local)
pnpm run test:browser
```

- Crea archivos `*.spec.ts` en la misma carpeta que el archivo que testeas.
- Mockea dependencias externas; no hagas llamadas HTTP reales en tests unitarios.
- El coverage mínimo aceptable es el que ya está configurado en `karma.conf.js`.

---

## Comandos útiles disponibles

| Comando | Descripción |
|---------|-------------|
| `/gen-component` | Genera un componente Angular standalone completo |
| `/gen-ngrx-feature` | Genera un feature completo de NgRx |
| `/gen-service` | Genera un servicio Angular |
| `/gen-bff-endpoint` | Genera un endpoint BFF completo (ruta + controlador + servicio Angular) |
| `/review-pr` | Revisa un PR siguiendo las convenciones del proyecto |

---

## Reglas de idioma

- El idioma por defecto de la UI es **español**.
- Los archivos de traducción están en `src/assets/i18n/`.
- Usa `| translate` cuando la clave ya exista en los archivos i18n.
- Para strings nuevos o de prototipado rápido está bien dejarlos en duro temporalmente, pero añade un comentario `// TODO: i18n` para revisarlo después.
- No es obligatorio añadir claves i18n al crear o modificar UI si el contexto es prototipado o iteración rápida.

---

## Política de seguridad de dependencias

### Reglas

- Ejecuta `pnpm audit` antes de todo PR que toque dependencias
- Tolerancia cero para vulnerabilidades `critical` o `high` en merge
- Usa `pnpm install --frozen-lockfile` en CI/CD, nunca `pnpm install` sin flag
- Nunca ejecutes `pnpm audit --fix` sin rama separada y suite de tests pasando
- Al actualizar Angular, actualiza **todos** los paquetes `@angular/*` a la vez — comparten peer deps y deben estar en la misma versión de patch

### Al añadir dependencias

- Verifica que el paquete tiene release reciente (< 12 meses)
- El paquete `request` está **PROHIBIDO** — usa `fetch` nativo o `axios`

### Riesgos aceptados temporalmente

| Paquete | CVE | Motivo | Fecha | Owner |
|---------|-----|--------|-------|-------|
| `request` + transitivos (`form-data`, `qs`, `tough-cookie`) | GHSA-p8p7-x288-28g6, GHSA-fjxv-7rqg-78g4, GHSA-6rw7-vpxm-498p, GHSA-72xf-g2v4-qvf3 | Dep transitiva de `node-vault-client` en `server/config/app.config.js` (archivo protegido). `request` está abandonado sin fix upstream. Eliminar reemplazando `node-vault-client` por `node-vault`. | 2026-03-31 | — |

### Enforcement en CI

```yaml
- name: Security audit
  run: pnpm audit --audit-level high
```
