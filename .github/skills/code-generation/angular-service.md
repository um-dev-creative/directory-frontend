# Skill: Angular Service Generation

## Purpose

Generate Angular services following Directory Frontend conventions: `inject()` function, `HttpService` for HTTP calls, path aliases, and `providedIn: 'root'`.

## When to Use

- Creating services that communicate with the BFF
- Creating utility services for shared functionality
- Creating feature-specific services

## Service Template

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { DFC } from '@shared/constants/app.const';
import { {Feature}Model } from '@shared/models/{feature}.model';

@Injectable({ providedIn: 'root' })
export class {Feature}Service {
  private readonly http = inject(HttpService);

  getAll(): Observable<{Feature}Model[]> {
    return this.http.get<{Feature}Model[]>(DFC.RelativePath.{FEATURE}_PATH);
  }

  getById(id: string): Observable<{Feature}Model> {
    return this.http.get<{Feature}Model>(`${DFC.RelativePath.{FEATURE}_PATH}/${id}`);
  }

  create(data: Partial<{Feature}Model>): Observable<{Feature}Model> {
    return this.http.post<{Feature}Model>(DFC.RelativePath.{FEATURE}_PATH, data);
  }

  update(id: string, data: Partial<{Feature}Model>): Observable<{Feature}Model> {
    return this.http.put<{Feature}Model>(`${DFC.RelativePath.{FEATURE}_PATH}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${DFC.RelativePath.{FEATURE}_PATH}/${id}`);
  }
}
```

## Rules

1. **Always** use `inject()` — never constructor injection
2. **Always** use `HttpService` from `@core/services/http.service.ts` — never raw `HttpClient`
3. **Always** build URLs from `DFC.RelativePath.*` constants — never hardcode URLs
4. **Always** use path aliases (`@core/`, `@shared/`, `@app/`)
5. **Always** type return values as `Observable<T>`
6. **Always** co-locate the spec file: `{feature}.service.spec.ts`

## File Placement

| Service type | Location |
|---|---|
| Core singleton | `src/app/core/services/` |
| Feature-specific | `src/app/features/{feature}/services/` |
| Shared utility | `src/app/shared/services/` |

## DFC Constant Registration

When creating a new service, add the BFF path constant to `src/app/shared/constants/app.const.ts`:

```typescript
export class DFC {
  static readonly RelativePath = {
    // ...existing paths...
    {FEATURE}_PATH: '/drb/api/v1/{resource}',
  };
}
```

## Spec File Template

```typescript
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { {Feature}Service } from './{feature}.service';
import { HttpService } from '@core/services/http.service';
import { DFC } from '@shared/constants/app.const';

describe('{Feature}Service', () => {
  let service: {Feature}Service;
  let httpSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete', 'patch']);

    TestBed.configureTestingModule({
      providers: [
        {Feature}Service,
        { provide: HttpService, useValue: httpSpy }
      ]
    });
    service = TestBed.inject({Feature}Service);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should call correct path on getAll', () => {
    const mockData = [{ id: '1', name: 'Test' }];
    httpSpy.get.and.returnValue(of(mockData));

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    expect(httpSpy.get).toHaveBeenCalledWith(DFC.RelativePath.{FEATURE}_PATH);
  });

  it('should handle HTTP errors', () => {
    httpSpy.get.and.returnValue(throwError(() => new Error('Network error')));

    service.getAll().subscribe({
      next: () => fail('Expected error'),
      error: (err) => expect(err.message).toBe('Network error')
    });
  });
});
```

