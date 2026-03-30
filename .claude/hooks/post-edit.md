# Hook: Post-Edit — Verificaciones después de editar un archivo

Este hook define las comprobaciones que Claude debe realizar **después de modificar cualquier archivo** en este proyecto.

---

## Verificaciones obligatorias tras cada edición

### 1. Validación de sintaxis y coherencia

#### Componentes Angular (`*.component.ts`)

Confirma que el archivo editado:
- [ ] Tiene `standalone: true`
- [ ] El array `imports: []` incluye todo lo usado en el template (TranslateModule, CommonModule, etc.)
- [ ] No hay imports de NgModule propios del proyecto
- [ ] Las dependencias inyectadas usan `inject()` en el cuerpo de la clase

#### Templates (`*.component.html`)

Confirma:
- [ ] Ninguna directiva `*ngIf`, `*ngFor`, `*ngSwitch` presente
- [ ] Todos los textos visibles usan `{{ 'clave.traduccion' | translate }}`
- [ ] Sin strings en duro en atributos `placeholder`, `title`, `aria-label`, `alt`

#### NgRx

- [ ] Acciones siguen formato `[Feature] Verbo sustantivo`
- [ ] Reducer es función pura (sin llamadas a servicios, sin efectos secundarios)
- [ ] Selectors derivan de `createFeatureSelector` o de otros selectors
- [ ] Effects manejan el error con `catchError` → acción `*Fallido`

#### BFF (`server/**/*.js`)

- [ ] Sin credenciales o tokens en duro en el código
- [ ] Respuestas de error no exponen stack traces al cliente
- [ ] Variables de entorno accedidas con `process.env.*`

---

### 2. Verificar imports y exports

Si se creó un archivo nuevo:
- ¿Debe exportarse desde el `index.ts` de la carpeta? Si la carpeta tiene un barrel file, agrégalo.
- ¿Debe registrarse en `app.config.ts`? (reducers, effects, providers)

Si se eliminó o renombró un archivo:
- Verifica que no hay imports rotos en el resto del código.
- Busca referencias con `grep` antes de confirmar.

---

### 3. Recordatorio de pruebas

Después de cada edición significativa, indica:

```
📋 Ejecuta las pruebas para verificar que todo funciona correctamente:

ng test --code-coverage --no-watch --browsers ChromeHeadlessNoSandbox
```

Si el cambio afectó:
- **Lógica de negocio** → los tests unitarios del archivo deben actualizarse.
- **Interfaz pública de un componente** (nuevos @Input/@Output) → el spec del componente necesita casos nuevos.
- **Acciones o reducers NgRx** → los specs del reducer y los selectors deben revisarse.
- **Rutas del BFF** → si existen tests de integración, ejecutarlos.

---

### 4. Claves de traducción

Si el template editado introduce texto nuevo o modifica etiquetas existentes:

Recuerda añadir las claves de traducción en:
```
src/assets/i18n/es.json    ← Español (principal)
src/assets/i18n/en.json    ← Inglés (si aplica)
```

Formato de clave recomendado: `feature.componente.elemento`

```json
{
  "partner": {
    "ofertas": {
      "titulo": "Mis ofertas",
      "sin-resultados": "No hay ofertas disponibles"
    }
  }
}
```

---

### 5. Compatibilidad SSR — revisión final

Si el archivo editado introduce código que accede a APIs del navegador, confirma:

```typescript
// ✅ Correcto
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

private readonly platformId = inject(PLATFORM_ID);

if (isPlatformBrowser(this.platformId)) {
  // Código browser-only aquí
}

// ✅ Alternativa para storage
private readonly storage = inject(StorageMockService);
```

Si encontraste acceso inseguro a APIs browser, **indícalo** aunque hayas completado la edición.

---

### 6. Registro de cambios relevantes

Si el cambio es arquitectónico (nuevo store, nuevo interceptor, nueva ruta lazy, nueva dependencia npm), menciona brevemente:
- Qué se añadió y por qué
- Qué partes del sistema afecta
- Si requiere cambios en `app.config.ts`, `app.routes.ts` u otros archivos de configuración

---

## Resumen del flujo post-edit

```
1. Confirmar que el archivo editado cumple las convenciones del tipo

2. Verificar imports/exports
   → ¿Necesita barrel update?
   → ¿Necesita registro en app.config.ts?

3. ¿Se agregó texto visible?
   → Recordar añadir claves en i18n/

4. ¿Se usaron APIs browser-only?
   → Verificar protección SSR

5. Indicar comando de test a ejecutar

6. Informar al usuario del resultado y próximos pasos
```
