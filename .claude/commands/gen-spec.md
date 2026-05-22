# /gen-spec — Generate Unit Test File

Generates a `.spec.ts` file for an existing Angular component, service, NgRx reducer, selector, or effect that lacks tests.

## Usage

```
/gen-spec <path>
```

**Examples:**
- `/gen-spec src/app/features/partner/components/offer-card/offer-card.component.ts`
- `/gen-spec src/app/core/services/business/business.client.ts`
- `/gen-spec src/app/features/partner/store/partner.reducer.ts`
- `/gen-spec src/app/features/partner/store/partner.effects.ts`

---

## Steps before generating

1. **Read the source file** completely before writing any test.
2. Identify the file type from the path:
   - `*.component.ts` → Component spec
   - `*.service.ts` / `*.client.ts` → Service spec
   - `*.reducer.ts` → Reducer spec
   - `*.selectors.ts` → Selector spec
   - `*.effects.ts` → Effects spec
3. Check whether a `*.spec.ts` already exists at the same path. If it does, report it and ask for confirmation before overwriting.
4. Identify all public methods, `input()` / `@Input()`, `output()` / `@Output()`, injected dependencies, and relevant NgRx actions.

---

## Component spec

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { <NameComponent> } from './<name>.component';

describe('<NameComponent>', () => {
  let component: <NameComponent>;
  let fixture: ComponentFixture<<NameComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        <NameComponent>,
        TranslateModule.forRoot()
      ],
      providers: [
        // Mock each injected service
        { provide: MyService, useValue: jasmine.createSpyObj('MyService', ['method']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(<NameComponent>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // One test per input() / @Input() — verify template binding
  // One test per output() / @Output() — trigger the event and assert the emission
  // One test per conditional @if block — verify the DOM changes
});
```

Rules:
- Never make real HTTP calls — mock all services with `jasmine.createSpyObj`.
- If the component uses the NgRx store, mock via `provideMockStore()` from `@ngrx/store/testing`.
- If the component uses `TranslateModule`, always include `TranslateModule.forRoot()`.
- If the component uses `RouterModule` or `RouterLink`, include `RouterTestingModule`.

---

## Service / Client spec

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { <NameService> } from './<name>.service';

describe('<NameService>', () => {
  let service: <NameService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [<NameService>]
    });
    service = TestBed.inject(<NameService>);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // One test per public method — verify URL, method, and return type
});
```

For `bff-client` services, use `HttpService` spy instead of `HttpTestingController`:

```typescript
providers: [
  { provide: HttpService, useValue: jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']) }
]
```

---

## Reducer spec

```typescript
import { reducer, initialState } from './<feature>.reducer';
import * as <Feature>Actions from './<feature>.actions';

describe('<Feature>Reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should set loading on <load> action', () => {
    const state = reducer(initialState, <Feature>Actions.load());
    expect(state.loading).toBeTrue();
  });

  it('should populate data on <loadSuccess>', () => {
    const items = [/* mock data */];
    const state = reducer({ ...initialState, loading: true }, <Feature>Actions.loadSuccess({ items }));
    expect(state.items).toEqual(items);
    expect(state.loading).toBeFalse();
  });

  it('should capture error on <loadFailure>', () => {
    const state = reducer({ ...initialState, loading: true }, <Feature>Actions.loadFailure({ error: 'Error' }));
    expect(state.error).toBe('Error');
    expect(state.loading).toBeFalse();
  });
});
```

---

## Selectors spec

```typescript
import * as <Feature>Selectors from './<feature>.selectors';
import { initialState } from './<feature>.reducer';

describe('<Feature> selectors', () => {
  const state = { <feature>: { ...initialState, items: [/* mock */] } };

  it('should select items', () => {
    expect(<Feature>Selectors.selectItems.projector(state.<feature>)).toEqual(state.<feature>.items);
  });

  it('should report not loading', () => {
    expect(<Feature>Selectors.selectLoading.projector(state.<feature>)).toBeFalse();
  });
});
```

---

## Effects spec

```typescript
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { <Feature>Effects } from './<feature>.effects';
import * as <Feature>Actions from './<feature>.actions';

describe('<Feature>Effects', () => {
  let actions$: Observable<Action>;
  let effects: <Feature>Effects;
  let featureService: jasmine.SpyObj<<FeatureService>>;

  beforeEach(() => {
    featureService = jasmine.createSpyObj('<FeatureService>', ['getAll']);
    TestBed.configureTestingModule({
      providers: [
        <Feature>Effects,
        provideMockActions(() => actions$),
        { provide: <FeatureService>, useValue: featureService }
      ]
    });
    effects = TestBed.inject(<Feature>Effects);
  });

  it('should dispatch loadSuccess on successful fetch', (done) => {
    const items = [/* mock */];
    featureService.getAll.and.returnValue(of(items));
    actions$ = of(<Feature>Actions.load());

    effects.load$.subscribe(action => {
      expect(action).toEqual(<Feature>Actions.loadSuccess({ items }));
      done();
    });
  });

  it('should dispatch loadFailure on error', (done) => {
    featureService.getAll.and.returnValue(throwError(() => new Error('Error')));
    actions$ = of(<Feature>Actions.load());

    effects.load$.subscribe(action => {
      expect(action).toEqual(<Feature>Actions.loadFailure({ error: 'Error' }));
      done();
    });
  });
});
```

---

## Checklist before delivering

- [ ] No real HTTP calls — all external dependencies mocked
- [ ] `afterEach(() => httpMock.verify())` present when using `HttpTestingController`
- [ ] At least one test per public method / input / output
- [ ] `TranslateModule.forRoot()` included for components with `| translate`
- [ ] NgRx store mocked with `provideMockStore()` when used
- [ ] File placed in the same directory as the source file
