# Hook: Pre-Edit — Verificaciones antes de editar un archivo

Este hook define las comprobaciones que Claude debe realizar **antes de modificar cualquier archivo** en este proyecto.

---

## Verificaciones obligatorias

### 1. Archivo protegido — detención inmediata

Si el archivo objetivo pertenece a alguna de estas rutas, **detén la edición y notifica al usuario**:

```
ssl/
dist/
Dockerfile
docker-entrypoint.sh
server/config/app.config.js
```

Mensaje de parada:
> "⛔ No puedo modificar `<archivo>` — está en la lista de archivos protegidos del proyecto. Si necesitas cambios en esta área, realízalos manualmente."

---

### 2. Leer el archivo antes de editar

**Siempre** usa la herramienta `Read` para leer el contenido completo del archivo antes de proponer cualquier cambio. Nunca edites a ciegas.

---

### 3. Verificar convenciones según tipo de archivo

#### Si es un componente Angular (`*.component.ts`)

Comprueba que el archivo **ya tenga** o que los cambios **mantengan**:
- `standalone: true` en el decorador `@Component`
- Ausencia de referencias a NgModule
- Uso de `inject()` para dependencias (no `constructor` con DI, salvo herencia)

Si detectas una violación existente, **no la propagues** en tu edición y menciona el hallazgo.

#### Si es un template Angular (`*.component.html`)

Verifica que el template objetivo usa (o seguirá usando tras el cambio):
- `@if` / `@for` / `@let` — **no** `*ngIf` / `*ngFor` / `*ngSwitch`
- `{{ 'clave' | translate }}` para cualquier texto visible — **no** strings en duro
- Sin URLs hardcodeadas en `href`, `src` o `[routerLink]` absolutas externas

#### Si es un effect NgRx (`*.effects.ts`)

Verifica:
- Existe un `catchError` que despacha la acción `*Fallido`
- No hay llamadas HTTP directas al backend Java (sin pasar por el BFF)

#### Si es un archivo del BFF (`server/**/*.js`)

Verifica:
- No se introducen credenciales o secrets en duro
- Las URLs de backend se leen de `process.env.*` o de la config central
- No se expone información sensible en las respuestas

#### Si es un archivo de entorno (`src/environments/*.ts`)

- Confirmar que solo contiene `environment.*` — sin credenciales reales
- Verificar que no se añaden URLs de backend Java directas (van en el BFF)

---

### 4. Comprobación SSR

Si el archivo modificado usa cualquiera de estas APIs:
- `window`, `document`, `navigator`, `location`
- `localStorage`, `sessionStorage`, `indexedDB`
- `setTimeout`, `setInterval` (sin cleanup)

Verifica que estén envueltas con `isPlatformBrowser()` o que usen `StorageMockService`. Si no lo están, avisa antes de proceder.

---

### 5. Impacto en tests

Si el archivo modificado tiene un `*.spec.ts` correspondiente:
- Menciona que los tests pueden necesitar actualización.
- Si el cambio afecta la interfaz pública (inputs, outputs, métodos públicos, acciones NgRx), indica qué specs deben revisarse.

---

## Resumen del flujo pre-edit

```
1. ¿Es un archivo protegido?
   → SÍ: Detener y notificar
   → NO: Continuar

2. Leer el archivo completo

3. ¿Es un componente Angular?
   → Verificar standalone, inject(), sin NgModule

4. ¿Es un template?
   → Verificar @if/@for/@let, | translate, sin strings en duro

5. ¿Usa APIs browser-only?
   → Verificar protección SSR

6. ¿Tiene spec correspondiente?
   → Avisar sobre posible actualización de tests

7. Proceder con la edición
```
