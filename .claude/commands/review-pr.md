# /review-pr — Revisar Pull Request

Revisa un PR siguiendo las convenciones y reglas del proyecto Directory Frontend.

## Uso

```
/review-pr <número-pr>
/review-pr <número-pr> --focus <area>
```

**Ejemplos:**
- `/review-pr 72`
- `/review-pr 72 --focus ngrx`
- `/review-pr 72 --focus seguridad`

---

## Proceso de revisión

Ejecuta los siguientes pasos en orden:

### 1. Obtener los cambios del PR

```bash
gh pr view <número> --json title,body,files,additions,deletions
gh pr diff <número>
```

### 2. Checklist de revisión obligatoria

Para cada archivo modificado, verifica:

#### Angular — Componentes
- [ ] `standalone: true` en todos los componentes nuevos o modificados
- [ ] Sin `NgModule` — no importar ni declarar en módulos
- [ ] Inyección con `inject()`, no con constructor (salvo herencia necesaria)
- [ ] Templates usan `@if` / `@for` / `@let` — no `*ngIf` / `*ngFor` / `*ngSwitch`
- [ ] Todos los textos visibles usan `{{ 'clave' | translate }}` — sin strings en duro
- [ ] Claves de traducción nuevas añadidas al archivo i18n correspondiente

#### Estado (NgRx / Signals)
- [ ] Estado global gestionado con NgRx (store/actions/reducer/effects/selectors)
- [ ] Signals usados **solo** para estado local del componente
- [ ] Acciones con formato `[Feature] Verbo sustantivo`
- [ ] Reducers son funciones puras (sin efectos secundarios)
- [ ] Effects manejan errores y despachan acción `*Fallido`

#### HTTP y BFF
- [ ] Sin llamadas HTTP directas al backend Java — todo pasa por `server/`
- [ ] Se usa `HttpService` (no `HttpClient` directamente)
- [ ] URLs construidas con constantes `DFC` o `environment`, nunca hardcodeadas
- [ ] El BFF en `server/` no expone datos sensibles ni credenciales

#### SSR — Server-Side Rendering
- [ ] Sin acceso directo a `window`, `document`, `localStorage` o `sessionStorage`
- [ ] Uso de `isPlatformBrowser()` o `StorageMockService` donde aplique
- [ ] Sin timers o intervals sin cleanup (pueden causar memory leaks en SSR)

#### Seguridad
- [ ] Sin credenciales, tokens ni secrets en el código fuente
- [ ] Sin `console.log` con datos sensibles de usuario
- [ ] Inputs del usuario sanitizados antes de renderizar como HTML
- [ ] Sin bypass de guards de autenticación

#### Calidad de código
- [ ] TypeScript strict — sin `any` salvo justificación explícita
- [ ] Sin código comentado o muerto
- [ ] Imports organizados: Angular > terceros > propios (usando aliases `@app`, `@core`, `@shared`)
- [ ] Archivos de test actualizados para cubrir los cambios

#### Archivos prohibidos
- [ ] No se tocaron: `ssl/`, `dist/`, `Dockerfile`, `docker-entrypoint.sh`, `server/config/app.config.js`

---

### 3. Formato del reporte de revisión

Entrega el resultado con esta estructura en español:

```markdown
## Revisión PR #<número>: <título>

### Resumen
<Breve descripción de qué hace el PR y su impacto>

### ✅ Puntos positivos
- <Buenas prácticas detectadas>

### ⚠️ Observaciones (no bloqueantes)
- **<archivo>:<línea>** — <descripción del problema y sugerencia>

### 🚫 Problemas bloqueantes
- **<archivo>:<línea>** — <descripción del problema>
  ```
  // Código problemático
  ```
  **Solución sugerida:**
  ```
  // Código corregido
  ```

### 📋 Checklist final
- [ ] Componentes standalone
- [ ] Sin *ngIf/*ngFor
- [ ] Traducciones completas
- [ ] Sin URLs hardcodeadas
- [ ] SSR compatible
- [ ] Tests actualizados
- [ ] Archivos prohibidos intactos

### Veredicto
🟢 APROBADO / 🟡 APROBADO CON OBSERVACIONES / 🔴 CAMBIOS REQUERIDOS
```

---

## Notas adicionales

- Si el PR toca el BFF (`server/`), verifica que los controladores no expongan datos del backend Java innecesariamente.
- Si el PR agrega dependencias nuevas, verifica que sean necesarias y que no introduzcan vulnerabilidades conocidas.
- Los PRs deben apuntar a la rama `development`, no a `main`.
