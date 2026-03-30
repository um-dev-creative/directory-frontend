# /gen-service — Generar servicio Angular

Genera un servicio Angular 20 siguiendo las convenciones del proyecto.

## Uso

```
/gen-service <nombre> [--tipo core|feature|bff-client]
```

**Ejemplos:**
- `/gen-service notificacion-push --tipo core`
- `/gen-service campana --tipo feature`
- `/gen-service reporte-client --tipo bff-client`

---

## Tipos de servicio

### `core` — Servicio core de la aplicación

Se ubica en `src/app/core/services/<nombre>/`.

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class <Nombre>Service {
  private readonly http = inject(HttpService);
  private readonly logger = inject(LoggerService);
  private readonly notification = inject(NotificationService);

  // Prefijo de ruta — usa siempre constantes, nunca strings en duro
  private readonly BASE_PATH = '/api/<recurso>';

  obtenerTodos(): Observable<<Modelo>[]> {
    return this.http.get<<Modelo>[]>(this.BASE_PATH);
  }

  obtenerPorId(id: string): Observable<<Modelo>> {
    return this.http.get<<Modelo>>(`${this.BASE_PATH}/${id}`);
  }

  crear(datos: Crear<Modelo>Dto): Observable<<Modelo>> {
    return this.http.post<<Modelo>>(this.BASE_PATH, datos);
  }

  actualizar(id: string, datos: Actualizar<Modelo>Dto): Observable<<Modelo>> {
    return this.http.put<<Modelo>>(`${this.BASE_PATH}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_PATH}/${id}`);
  }
}
```

---

### `feature` — Servicio de feature específico

Se ubica en `src/app/features/<feature>/services/`.

Misma estructura que `core`, pero con el alcance limitado al feature. Registrar con `providedIn: 'root'` salvo que tenga datos de sesión específicos del feature.

---

### `bff-client` — Cliente HTTP hacia el BFF

Se ubica en `src/app/core/services/<recurso>/`. Extiende `ClientTemplate`:

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { ClientTemplate } from '@core/services/client-template';
import { DFC } from '@shared/constants';

@Injectable({ providedIn: 'root' })
export class <Recurso>Client extends ClientTemplate {
  private readonly http = inject(HttpService);

  // IMPORTANTE: Usar constantes DFC para construir la URL — nunca hardcodear
  private readonly BASE_PATH =
    DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL + DFC.RelativePath.<RECURSO>_PATH;

  obtener(id: string): Observable<<Modelo>> {
    return this.http.get<<Modelo>>(`${this.BASE_PATH}/${id}`);
  }
}
```

> **Regla crítica:** Todo HTTP hacia el backend Java debe pasar por el BFF Express en `server/`. Nunca llames directamente a la URL del backend Java desde Angular.

---

## Archivo de test — `<nombre>.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { <Nombre>Service } from './<nombre>.service';

describe('<Nombre>Service', () => {
  let service: <Nombre>Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [<Nombre>Service]
    });
    service = TestBed.inject(<Nombre>Service);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // Agrega tests para cada método público
  // Mockea HttpService y LoggerService con spies
});
```

---

## Lista de verificación

- [ ] `@Injectable({ providedIn: 'root' })` presente
- [ ] Inyección de dependencias con `inject()`, no con constructor
- [ ] Las URLs se construyen usando constantes `DFC` o `environment`
- [ ] Toda llamada HTTP usa `HttpService`, nunca `HttpClient` directamente
- [ ] Sin acceso a `localStorage`/`sessionStorage` — usar `StorageMockService`
- [ ] Archivo `.spec.ts` creado junto al servicio
- [ ] Exportado desde el `index.ts` de la carpeta si corresponde
