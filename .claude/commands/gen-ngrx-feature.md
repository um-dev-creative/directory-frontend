# /gen-ngrx-feature — Generar feature NgRx completo

Genera todos los archivos necesarios para un feature de NgRx 20 siguiendo la arquitectura del proyecto.

## Uso

```
/gen-ngrx-feature <nombre-feature>
```

**Ejemplo:** `/gen-ngrx-feature ofertas`

---

## Archivos a generar

Todos se crean en `src/app/core/store/<nombre-feature>/` (o en `src/app/features/<feature>/store/` si es un feature específico).

---

### 1. `<feature>.state.ts`

```typescript
export interface <Feature>State {
  items: <Modelo>[];
  itemSeleccionado: <Modelo> | null;
  cargando: boolean;
  error: string | null;
}

export const initialState: <Feature>State = {
  items: [],
  itemSeleccionado: null,
  cargando: false,
  error: null
};
```

---

### 2. `<feature>.actions.ts`

```typescript
import { createAction, props } from '@ngrx/store';
import { <Modelo> } from '../models/<modelo>.model';

// Convención: '[Feature] Verbo sustantivo'
export const cargar<Feature> = createAction('[<Feature>] Cargar <feature>');

export const cargar<Feature>Exitoso = createAction(
  '[<Feature>] Cargar <feature> exitoso',
  props<{ items: <Modelo>[] }>()
);

export const cargar<Feature>Fallido = createAction(
  '[<Feature>] Cargar <feature> fallido',
  props<{ error: string }>()
);

export const seleccionar<Feature> = createAction(
  '[<Feature>] Seleccionar <feature>',
  props<{ id: string }>()
);

export const limpiar<Feature> = createAction('[<Feature>] Limpiar <feature>');
```

---

### 3. `<feature>.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import { initialState, <Feature>State } from './<feature>.state';
import * as <Feature>Actions from './<feature>.actions';

const _<feature>Reducer = createReducer(
  initialState,

  on(<Feature>Actions.cargar<Feature>, (state) => ({
    ...state,
    cargando: true,
    error: null
  })),

  on(<Feature>Actions.cargar<Feature>Exitoso, (state, { items }) => ({
    ...state,
    items,
    cargando: false
  })),

  on(<Feature>Actions.cargar<Feature>Fallido, (state, { error }) => ({
    ...state,
    cargando: false,
    error
  })),

  on(<Feature>Actions.seleccionar<Feature>, (state, { id }) => ({
    ...state,
    itemSeleccionado: state.items.find(i => i.id === id) ?? null
  })),

  on(<Feature>Actions.limpiar<Feature>, () => initialState)
);

export function <feature>Reducer(state: <Feature>State | undefined, action: Action) {
  return _<feature>Reducer(state, action);
}
```

---

### 4. `<feature>.selectors.ts`

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { <Feature>State } from './<feature>.state';

export const select<Feature>State = createFeatureSelector<<Feature>State>('<feature>');

export const select<Feature>Items = createSelector(
  select<Feature>State,
  (state) => state.items
);

export const select<Feature>Seleccionado = createSelector(
  select<Feature>State,
  (state) => state.itemSeleccionado
);

export const select<Feature>Cargando = createSelector(
  select<Feature>State,
  (state) => state.cargando
);

export const select<Feature>Error = createSelector(
  select<Feature>State,
  (state) => state.error
);
```

---

### 5. `<feature>.effects.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as <Feature>Actions from './<feature>.actions';
import { <Feature>Service } from '@core/services/<feature>/<feature>.service';

@Injectable()
export class <Feature>Effects {
  private readonly actions$ = inject(Actions);
  private readonly <feature>Service = inject(<Feature>Service);

  cargar<Feature>$ = createEffect(() =>
    this.actions$.pipe(
      ofType(<Feature>Actions.cargar<Feature>),
      switchMap(() =>
        this.<feature>Service.obtenerTodos().pipe(
          map((items) => <Feature>Actions.cargar<Feature>Exitoso({ items })),
          catchError((error) =>
            of(<Feature>Actions.cargar<Feature>Fallido({ error: error.message }))
          )
        )
      )
    )
  );
}
```

---

### 6. `<feature>-store.service.ts`

Facade que encapsula el acceso al store para los componentes:

```typescript
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as <Feature>Actions from './<feature>.actions';
import * as <Feature>Selectors from './<feature>.selectors';

@Injectable({ providedIn: 'root' })
export class <Feature>StoreService {
  private readonly store = inject(Store);

  // Selectores como observables
  readonly items$ = this.store.select(<Feature>Selectors.select<Feature>Items);
  readonly cargando$ = this.store.select(<Feature>Selectors.select<Feature>Cargando);
  readonly error$ = this.store.select(<Feature>Selectors.select<Feature>Error);
  readonly seleccionado$ = this.store.select(<Feature>Selectors.select<Feature>Seleccionado);

  // Despacho de acciones
  cargar(): void {
    this.store.dispatch(<Feature>Actions.cargar<Feature>());
  }

  seleccionar(id: string): void {
    this.store.dispatch(<Feature>Actions.seleccionar<Feature>({ id }));
  }

  limpiar(): void {
    this.store.dispatch(<Feature>Actions.limpiar<Feature>());
  }
}
```

---

## Registrar en app.config.ts

Recuerda agregar el reducer y los efectos en `src/app/app.config.ts`:

```typescript
provideStore({ ..., <feature>: <feature>Reducer }),
provideEffects([..., <Feature>Effects]),
```

---

## Lista de verificación

- [ ] Los 6 archivos creados en la carpeta correcta
- [ ] Nombres de acciones en formato `[Feature] Verbo sustantivo`
- [ ] Reducer puro (sin efectos secundarios)
- [ ] Effects usan `switchMap` para cancelar peticiones previas (o `concatMap`/`mergeMap` si aplica)
- [ ] Facade (`StoreService`) creada para aislar componentes del store
- [ ] Feature registrado en `app.config.ts`
- [ ] Archivos `*.spec.ts` para el reducer y los selectors
