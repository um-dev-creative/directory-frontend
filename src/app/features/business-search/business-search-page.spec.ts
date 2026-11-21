import {PLATFORM_ID} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {convertToParamMap, provideRouter, Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {BusinessSearchStoreService} from '@core/store/business-search/business-search-store.service';
import {CategoryClient} from '@core/services/category/category.client';
import {LoggerService} from '@core/services/logger.service';
import {BusinessSearchItem, City} from '@shared/models/location.model';
import {BusinessSearchPage, paramsFromQuery, SEARCH_PAGE_SIZE} from './business-search-page';

const toronto: City = {id: 'c1', name: 'Toronto', province: 'Ontario', country: 'CA'};
const item: BusinessSearchItem = {
  id: 'b1', name: 'Panadería La Estrella', description: 'Pan fresco', categoryId: 'k1', categoryName: 'Panadería', verified: true,
  profileImageRef: null,
  locations: [{
    id: 'l1', businessId: 'b1', city: toronto, name: null, addressLine: '1 Main St', postalCode: null, phone: null, latitude: null,
    longitude: null, main: true, createdAt: '', lastUpdate: ''
  }]
};

describe('paramsFromQuery', () => {
  it('reads the filters and defaults the page to 1', () => {
    expect(paramsFromQuery(convertToParamMap({city_id: 'c1', category_id: 'k1', q: '  pan ', page: '3'})))
      .toEqual({cityId: 'c1', category: 'k1', q: 'pan', page: 3, perPage: SEARCH_PAGE_SIZE});
    expect(paramsFromQuery(convertToParamMap({})))
      .toEqual({cityId: null, category: null, q: null, page: 1, perPage: SEARCH_PAGE_SIZE});
  });

  it('ignores a page that is not a positive number', () => {
    for (const page of ['0', '-2', 'abc', '']) {
      expect(paramsFromQuery(convertToParamMap({page})).page).toBe(1);
    }
  });
});

describe('BusinessSearchPage', () => {
  let store: {
    search: jasmine.Spy; loadCities: jasmine.Spy; clear: jasmine.Spy;
    results$: BehaviorSubject<BusinessSearchItem[]>; totalCount$: BehaviorSubject<number>; page$: BehaviorSubject<number>;
    totalPages$: BehaviorSubject<number>; isSearching$: BehaviorSubject<boolean>; error$: BehaviorSubject<string | null>;
    isEmpty$: BehaviorSubject<boolean>; hasPreviousPage$: BehaviorSubject<boolean>; hasNextPage$: BehaviorSubject<boolean>;
    cities$: BehaviorSubject<City[]>;
  };
  let categoryClient: jasmine.SpyObj<CategoryClient>;

  const setup = async (url: string, platform = 'browser', categories$?: Observable<unknown>) => {
    store = {
      search: jasmine.createSpy('search'), loadCities: jasmine.createSpy('loadCities'), clear: jasmine.createSpy('clear'),
      results$: new BehaviorSubject<BusinessSearchItem[]>([]), totalCount$: new BehaviorSubject(0), page$: new BehaviorSubject(1),
      totalPages$: new BehaviorSubject(0), isSearching$: new BehaviorSubject(false), error$: new BehaviorSubject<string | null>(null),
      isEmpty$: new BehaviorSubject(false), hasPreviousPage$: new BehaviorSubject(false), hasNextPage$: new BehaviorSubject(false),
      cities$: new BehaviorSubject<City[]>([toronto])
    };
    categoryClient = jasmine.createSpyObj('CategoryClient', ['getCategories']);
    categoryClient.getCategories.and.returnValue((categories$ ?? of({
      headers: {status: 200},
      data: [{id: 'k2', name: 'Taquería', x: 1}, {id: 'k1', name: 'Panadería'}]
    })) as never);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}})],
      providers: [
        provideRouter([{path: 'search', component: BusinessSearchPage}]),
        {provide: BusinessSearchStoreService, useValue: store},
        {provide: CategoryClient, useValue: categoryClient},
        {provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['debug', 'info', 'error'])},
        {provide: PLATFORM_ID, useValue: platform}
      ]
    });
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(url, BusinessSearchPage);
    harness.detectChanges();
    return {harness, component, element: harness.routeNativeElement as HTMLElement};
  };

  it('loads the cities and the categories and searches with the filters of the URL', async () => {
    const {element} = await setup('/search?city_id=c1&category_id=k1&q=pan&page=2');

    expect(store.loadCities).toHaveBeenCalled();
    expect(store.search).toHaveBeenCalledWith({cityId: 'c1', category: 'k1', q: 'pan', page: 2, perPage: SEARCH_PAGE_SIZE});
    const options = Array.from(element.querySelectorAll('select')[1].querySelectorAll('option')).map((o) => o.textContent?.trim());
    expect(options).toEqual(['business_search.all_categories', 'Panadería', 'Taquería']);
    expect((element.querySelectorAll('select')[0] as HTMLSelectElement).value).toBe('c1');
  });

  it('does nothing on the server (SSR): the browser searches after hydration', async () => {
    await setup('/search?q=pan', 'server');
    expect(store.search).not.toHaveBeenCalled();
    expect(store.loadCities).not.toHaveBeenCalled();
    expect(categoryClient.getCategories).not.toHaveBeenCalled();
  });

  it('shows the results with their locations and a link to the business', async () => {
    const {harness, element} = await setup('/search');
    store.results$.next([item]);
    store.totalCount$.next(1);
    harness.detectChanges();

    expect(element.querySelector('.search-card-title')?.textContent).toContain('Panadería La Estrella');
    expect(element.querySelector('.search-card-title')?.getAttribute('href')).toBe('/partner/b1');
    expect(element.querySelector('.search-card-verified')).not.toBeNull();
    expect(element.querySelector('.search-card-locations')?.textContent).toContain('Toronto');
    expect(element.querySelector('.search-card-locations')?.textContent).toContain('1 Main St');
  });

  it('says so when nothing matches, and when the search fails', async () => {
    const {harness, element} = await setup('/search?q=zzz');
    store.isEmpty$.next(true);
    harness.detectChanges();
    expect(element.textContent).toContain('business_search.empty');

    store.isEmpty$.next(false);
    store.error$.next('down');
    harness.detectChanges();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('business_search.error');
  });

  it('puts the filters in the URL, resets the page and removes the empty ones', async () => {
    const {harness, component} = await setup('/search?page=3');
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.callThrough();
    const select = (value: string) => ({target: {value}}) as unknown as Event;

    component['onCityChange'](select('c1'));
    component['onCategoryChange'](select(''));
    component['onTextSubmit']('pan');
    await harness.fixture.whenStable();

    const queries = navigate.calls.allArgs().map(([, extras]) => extras?.queryParams);
    expect(queries).toEqual([{city_id: 'c1', page: null}, {category_id: null, page: null}, {q: 'pan', page: null}]);
    expect(navigate.calls.first().args[1]?.queryParamsHandling).toBe('merge');
  });

  it('does not navigate when the text is cleared and there was none', async () => {
    const {component} = await setup('/search');
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.callThrough();
    component['onTextClear']();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('removes the text from the URL when it is cleared', async () => {
    const {component} = await setup('/search?q=pan');
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.callThrough();
    component['onTextClear']();
    expect(navigate.calls.mostRecent().args[1]?.queryParams).toEqual({q: null, page: null});
  });

  it('pages with previous and next, and drops the page parameter for the first one', async () => {
    const {harness, component, element} = await setup('/search?page=2');
    store.totalPages$.next(3);
    store.page$.next(2);
    store.hasPreviousPage$.next(true);
    store.hasNextPage$.next(true);
    harness.detectChanges();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.callThrough();

    const [previous, next] = Array.from(element.querySelectorAll('.search-pagination button')) as HTMLButtonElement[];
    expect(previous.disabled).toBeFalse();
    previous.click();
    next.click();
    component['goToPage'](1);

    expect(navigate.calls.allArgs().map(([, extras]) => extras?.queryParams)).toEqual([{page: null}, {page: 3}, {page: null}]);
  });

  it('hides the pagination when there is one page only and disables the buttons at the ends', async () => {
    const {harness, element} = await setup('/search');
    store.totalPages$.next(1);
    harness.detectChanges();
    expect(element.querySelector('.search-pagination')).toBeNull();

    store.totalPages$.next(2);
    harness.detectChanges();
    const [previous, next] = Array.from(element.querySelectorAll('.search-pagination button')) as HTMLButtonElement[];
    expect(previous.disabled).toBeTrue();
    expect(next.disabled).toBeTrue();
  });

  it('keeps an empty category list when the categories request fails', async () => {
    const {component} = await setup('/search', 'browser', throwError(() => new Error('down')));
    expect(component['categories']()).toEqual([]);
  });

  it('keeps an empty category list when the BFF answers without categories', async () => {
    const {component} = await setup('/search', 'browser', of({headers: {status: 500}, data: null}));
    expect(component['categories']()).toEqual([]);
  });
});
