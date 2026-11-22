import {PLATFORM_ID} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BehaviorSubject, of} from 'rxjs';
import {BusinessSearchStoreService} from '@core/store/business-search/business-search-store.service';
import {LocationsStoreService} from '@core/store/locations/locations-store.service';
import {City, Location} from '@shared/models/location.model';
import {PartnerLocationsSettingsComponent} from './partner-locations-settings.component';

const toronto: City = {id: 'c1', name: 'Toronto', province: 'Ontario', country: 'CA'};
const make = (id: string, main: boolean, address: string): Location => ({
  id, businessId: 'b1', city: toronto, name: main ? 'Matriz' : null, addressLine: address, postalCode: 'M5V 2T6', phone: '416-555-0100',
  latitude: null, longitude: null, main, createdAt: '', lastUpdate: ''
});

describe('PartnerLocationsSettingsComponent', () => {
  let fixture: ComponentFixture<PartnerLocationsSettingsComponent>;
  let component: PartnerLocationsSettingsComponent;
  let locationsStore: {
    load: jasmine.Spy; create: jasmine.Spy; update: jasmine.Spy; remove: jasmine.Spy; clear: jasmine.Spy;
    locations$: BehaviorSubject<Location[]>; isLoading$: BehaviorSubject<boolean>; isSaving$: BehaviorSubject<boolean>;
    error$: BehaviorSubject<string | null>;
  };
  let searchStore: { loadCities: jasmine.Spy; cities$: BehaviorSubject<City[]> };
  let businesses: string[];
  let element: HTMLElement;

  const create = async (platform = 'browser') => {
    TestBed.configureTestingModule({
      imports: [
        PartnerLocationsSettingsComponent,
        TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}})
      ],
      providers: [
        provideRouter([]),
        {provide: PLATFORM_ID, useValue: platform},
        {provide: Store, useValue: {select: (selector: (state: unknown) => unknown) => of(selector({session: {sessionData: {userAuth: {businesses}}}}))}},
        {provide: LocationsStoreService, useValue: locationsStore},
        {provide: BusinessSearchStoreService, useValue: searchStore}
      ]
    });
    fixture = TestBed.createComponent(PartnerLocationsSettingsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const click = (selector: string, index = 0) => {
    (element.querySelectorAll(selector)[index] as HTMLElement).click();
    fixture.detectChanges();
  };

  const fill = (selector: string, value: string) => {
    const field = element.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
    field.value = value;
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? 'change' : 'input'));
    fixture.detectChanges();
  };

  beforeEach(() => {
    businesses = ['b1'];
    locationsStore = {
      load: jasmine.createSpy('load'), create: jasmine.createSpy('create'), update: jasmine.createSpy('update'),
      remove: jasmine.createSpy('remove'), clear: jasmine.createSpy('clear'),
      locations$: new BehaviorSubject<Location[]>([]), isLoading$: new BehaviorSubject(false), isSaving$: new BehaviorSubject(false),
      error$: new BehaviorSubject<string | null>(null)
    };
    searchStore = {loadCities: jasmine.createSpy('loadCities'), cities$: new BehaviorSubject<City[]>([toronto])};
  });

  it('loads the locations of the first business of the session and the cities when there are none', async () => {
    searchStore.cities$.next([]);
    await create();
    expect(locationsStore.load).toHaveBeenCalledWith('b1');
    expect(searchStore.loadCities).toHaveBeenCalled();
  });

  it('does not reload the cities it already has', async () => {
    await create();
    expect(searchStore.loadCities).not.toHaveBeenCalled();
  });

  it('does not touch the backend on the server (SSR)', async () => {
    await create('server');
    expect(locationsStore.load).not.toHaveBeenCalled();
    expect(searchStore.loadCities).not.toHaveBeenCalled();
  });

  it('asks the user to register a business first when there is none', async () => {
    businesses = [];
    await create();
    expect(locationsStore.load).not.toHaveBeenCalled();
    expect(element.textContent).toContain('locations.no_business');
    expect(element.querySelector('.locations-primary')).toBeNull();
  });

  it('lists the locations with the main one marked', async () => {
    locationsStore.locations$.next([make('l1', true, '1 Main St'), make('l2', false, '2 Side St')]);
    await create();
    const cards = element.querySelectorAll('.locations-card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Matriz');
    expect(cards[0].querySelector('.locations-badge')).not.toBeNull();
    expect(cards[1].textContent).toContain('2 Side St');
    expect(cards[1].querySelector('.locations-badge')).toBeNull();
    expect(cards[0].textContent).not.toContain('locations.make_main');
    expect(cards[1].textContent).toContain('locations.make_main');
  });

  it('shows the loading and the empty states', async () => {
    locationsStore.isLoading$.next(true);
    await create();
    expect(element.textContent).toContain('locations.loading');
    locationsStore.isLoading$.next(false);
    fixture.detectChanges();
    expect(element.textContent).toContain('locations.empty');
  });

  it('shows the error of the store', async () => {
    locationsStore.error$.next('forbidden');
    await create();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('locations.error');
  });

  it('does not save an invalid form and shows what is missing', async () => {
    await create();
    click('.locations-primary');
    expect(element.querySelector('form')).not.toBeNull();

    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(locationsStore.create).not.toHaveBeenCalled();
    expect(element.textContent).toContain('locations.errors.city_required');
    expect(element.textContent).toContain('locations.errors.address_required');
  });

  it('rejects an address that is only spaces', async () => {
    await create();
    click('.locations-primary');
    fill('select[formControlName="cityId"]', 'c1');
    fill('input[formControlName="addressLine"]', '    ');
    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(locationsStore.create).not.toHaveBeenCalled();
    expect(element.textContent).toContain('locations.errors.address_required');
  });

  it('creates a location with the form values', async () => {
    await create();
    click('.locations-primary');
    fill('select[formControlName="cityId"]', 'c1');
    fill('input[formControlName="addressLine"]', '1 Main St');
    fill('input[formControlName="name"]', 'Matriz');
    fill('input[formControlName="postalCode"]', 'M5V 2T6');
    fill('input[formControlName="phone"]', '416-555-0100');
    (element.querySelector('input[formControlName="main"]') as HTMLInputElement).click();
    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    expect(locationsStore.create).toHaveBeenCalledWith('b1', {
      cityId: 'c1', name: 'Matriz', addressLine: '1 Main St', postalCode: 'M5V 2T6', phone: '416-555-0100', main: true
    });
    expect(locationsStore.update).not.toHaveBeenCalled();
  });

  it('closes the form when the save finishes and keeps it open when it fails', async () => {
    await create();
    click('.locations-primary');
    fill('select[formControlName="cityId"]', 'c1');
    fill('input[formControlName="addressLine"]', '1 Main St');
    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    locationsStore.isSaving$.next(true);
    fixture.detectChanges();
    locationsStore.error$.next('forbidden');
    locationsStore.isSaving$.next(false);
    fixture.detectChanges();
    expect(element.querySelector('form')).not.toBeNull();

    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    locationsStore.error$.next(null);
    locationsStore.isSaving$.next(true);
    fixture.detectChanges();
    locationsStore.isSaving$.next(false);
    fixture.detectChanges();
    expect(element.querySelector('form')).toBeNull();
  });

  it('edits a location: the form is filled and the update goes to that location', async () => {
    locationsStore.locations$.next([make('l1', true, '1 Main St')]);
    await create();
    click('.locations-card .locations-secondary', 0);

    expect((element.querySelector('input[formControlName="addressLine"]') as HTMLInputElement).value).toBe('1 Main St');
    expect((element.querySelector('select[formControlName="cityId"]') as HTMLSelectElement).value).toBe('c1');
    fill('input[formControlName="addressLine"]', '9 New Ave');
    (element.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    expect(locationsStore.update).toHaveBeenCalledWith('b1', 'l1', jasmine.objectContaining({addressLine: '9 New Ave', cityId: 'c1'}));
    expect(locationsStore.create).not.toHaveBeenCalled();
  });

  it('edits a location that has no optional fields', async () => {
    const bare = {...make('l1', false, '1 Main St'), name: null, postalCode: null, phone: null};
    locationsStore.locations$.next([bare]);
    await create();
    component['openEdit'](bare);
    expect(component['form'].getRawValue()).toEqual({cityId: 'c1', name: '', addressLine: '1 Main St', postalCode: '', phone: '', main: false});
  });

  it('makes another location the main one, but only a location that is not', async () => {
    const main = make('l1', true, '1 Main St');
    const other = make('l2', false, '2 Side St');
    locationsStore.locations$.next([main, other]);
    await create();

    component['makeMain'](main);
    expect(locationsStore.update).not.toHaveBeenCalled();
    click('.locations-card:nth-child(2) .locations-secondary', 0);

    expect(locationsStore.update).toHaveBeenCalledWith('b1', 'l2', {main: true});
  });

  it('asks before deleting and deletes only after the confirmation', async () => {
    locationsStore.locations$.next([make('l2', false, '2 Side St')]);
    await create();

    click('.locations-danger');
    expect(locationsStore.remove).not.toHaveBeenCalled();
    expect(element.textContent).toContain('locations.delete_confirm');

    click('.locations-card .locations-secondary', 0); // cancel
    expect(element.textContent).not.toContain('locations.delete_confirm');
    expect(locationsStore.remove).not.toHaveBeenCalled();

    click('.locations-danger');
    click('.locations-danger');
    expect(locationsStore.remove).toHaveBeenCalledWith('b1', 'l2');
  });

  it('can close the form without saving and goes back to the settings', async () => {
    await create();
    click('.locations-primary');
    click('.locations-actions .locations-secondary', 0);
    expect(element.querySelector('form')).toBeNull();

    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    click('.back-button');
    expect(navigate).toHaveBeenCalledWith(['/partner/settings']);
  });

  it('ignores actions when there is no business', async () => {
    businesses = [];
    await create();
    component['submit']();
    component['makeMain'](make('l2', false, 'x'));
    component['confirmDelete'](make('l2', false, 'x'));
    expect(locationsStore.create).not.toHaveBeenCalled();
    expect(locationsStore.update).not.toHaveBeenCalled();
    expect(locationsStore.remove).not.toHaveBeenCalled();
  });
});
