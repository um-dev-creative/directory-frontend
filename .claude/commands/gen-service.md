# /gen-service — Generate Angular Service

Generates an Angular 20 service following project conventions.

## Usage

```
/gen-service <name> [--type core|feature|bff-client]
```

**Examples:**
- `/gen-service push-notification --type core`
- `/gen-service campaign --type feature`
- `/gen-service report-client --type bff-client`

---

## Service types

### `core` — Core application service

Located in `src/app/core/services/<name>/`.

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class <Name>Service {
  private readonly http = inject(HttpService);
  private readonly logger = inject(LoggerService);
  private readonly notification = inject(NotificationService);

  // Route prefix — always use constants, never hardcoded strings
  private readonly BASE_PATH = '/api/<resource>';

  getAll(): Observable<<Model>[]> {
    return this.http.get<<Model>[]>(this.BASE_PATH);
  }

  getById(id: string): Observable<<Model>> {
    return this.http.get<<Model>>(`${this.BASE_PATH}/${id}`);
  }

  create(data: Create<Model>Dto): Observable<<Model>> {
    return this.http.post<<Model>>(this.BASE_PATH, data);
  }

  update(id: string, data: Update<Model>Dto): Observable<<Model>> {
    return this.http.put<<Model>>(`${this.BASE_PATH}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_PATH}/${id}`);
  }
}
```

---

### `feature` — Feature-specific service

Located in `src/app/features/<feature>/services/`.

Same structure as `core`, but scoped to the feature. Register with `providedIn: 'root'` unless it holds feature-specific session data.

---

### `bff-client` — HTTP client toward the BFF

Located in `src/app/core/services/<resource>/`. Extends `ClientTemplate`:

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { ClientTemplate } from '@core/services/client-template';
import { DFC } from '@shared/constants';

@Injectable({ providedIn: 'root' })
export class <Resource>Client extends ClientTemplate {
  private readonly http = inject(HttpService);

  // IMPORTANT: Use DFC constants to build the URL — never hardcode
  private readonly BASE_PATH =
    DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL + DFC.RelativePath.<RESOURCE>_PATH;

  get(id: string): Observable<<Model>> {
    return this.http.get<<Model>>(`${this.BASE_PATH}/${id}`);
  }
}
```

> **Critical rule:** All HTTP calls to the Java backend must go through the Express BFF in `server/`. Never call the Java backend URL directly from Angular.

---

## Test file — `<name>.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { <Name>Service } from './<name>.service';

describe('<Name>Service', () => {
  let service: <Name>Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [<Name>Service]
    });
    service = TestBed.inject(<Name>Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add tests for each public method
  // Mock HttpService and LoggerService with spies
});
```

---

## Checklist

- [ ] `@Injectable({ providedIn: 'root' })` present
- [ ] Dependency injection with `inject()`, not constructor
- [ ] URLs built using `DFC` constants or `environment`
- [ ] All HTTP calls use `HttpService`, never `HttpClient` directly
- [ ] No direct `localStorage`/`sessionStorage` access — use `StorageMockService`
- [ ] `.spec.ts` file created alongside the service
- [ ] Exported from the folder's `index.ts` if applicable
