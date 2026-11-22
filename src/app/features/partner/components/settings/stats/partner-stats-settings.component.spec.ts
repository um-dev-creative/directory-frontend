import {PLATFORM_ID} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BehaviorSubject, of} from 'rxjs';
import {BusinessStatsStoreService} from '@core/store/business-stats/business-stats-store.service';
import {BusinessStats} from '@shared/models/business-stats.model';
import {PartnerStatsSettingsComponent} from './partner-stats-settings.component';

const stats: BusinessStats = {
  businessId: 'b1', from: '2026-11-19', to: '2026-11-21', totalViews: 9, viewsToday: 5, viewsLast7Days: 12,
  daily: [{date: '2026-11-19', views: 4}, {date: '2026-11-20', views: 0}, {date: '2026-11-21', views: 5}]
};

describe('PartnerStatsSettingsComponent', () => {
  let fixture: ComponentFixture<PartnerStatsSettingsComponent>;
  let component: PartnerStatsSettingsComponent;
  let element: HTMLElement;
  let statsStore: {
    load: jasmine.Spy; clear: jasmine.Spy; stats$: BehaviorSubject<BusinessStats | null>; isLoading$: BehaviorSubject<boolean>;
    error$: BehaviorSubject<string | null>; maxDailyViews$: BehaviorSubject<number>;
  };
  let businesses: string[];

  const create = async (platform = 'browser') => {
    TestBed.configureTestingModule({
      imports: [PartnerStatsSettingsComponent, TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}})],
      providers: [
        provideRouter([]),
        {provide: PLATFORM_ID, useValue: platform},
        {provide: Store, useValue: {select: (selector: (state: unknown) => unknown) => of(selector({session: {sessionData: {userAuth: {businesses}}}}))}},
        {provide: BusinessStatsStoreService, useValue: statsStore}
      ]
    });
    fixture = TestBed.createComponent(PartnerStatsSettingsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(() => {
    businesses = ['b1'];
    statsStore = {
      load: jasmine.createSpy('load'), clear: jasmine.createSpy('clear'), stats$: new BehaviorSubject<BusinessStats | null>(null),
      isLoading$: new BehaviorSubject(false), error$: new BehaviorSubject<string | null>(null), maxDailyViews$: new BehaviorSubject(5)
    };
  });

  it('loads the last 30 days of the first business of the session', async () => {
    await create();
    expect(statsStore.load).toHaveBeenCalledWith('b1', 30);
  });

  it('does not touch the backend on the server (SSR)', async () => {
    await create('server');
    expect(statsStore.load).not.toHaveBeenCalled();
  });

  it('asks the user to register a business first when there is none', async () => {
    businesses = [];
    await create();
    expect(statsStore.load).not.toHaveBeenCalled();
    expect(element.textContent).toContain('stats.no_business');
    expect(element.querySelector('.stats-windows')).toBeNull();
  });

  it('shows the figures and one bar per day', async () => {
    statsStore.stats$.next(stats);
    await create();
    const values = Array.from(element.querySelectorAll('.stats-tile-value')).map((v) => v.textContent?.trim());
    expect(values).toEqual(['9', '5', '12']);
    expect(element.querySelectorAll('.stats-bar').length).toBe(3);
    expect(element.querySelector('.stats-range')?.textContent).toContain('stats.range');
    expect(element.textContent).not.toContain('stats.empty');
  });

  it('scales the bars to the highest day and leaves empty days at zero', async () => {
    statsStore.stats$.next(stats);
    await create();
    const [first, second, third] = Array.from(element.querySelectorAll('.stats-bar')) as HTMLElement[];
    expect(first.style.height).toBe('80%');
    expect(second.style.height).toBe('0%');
    expect(third.style.height).toBe('100%');
    expect(component['barHeight']({date: 'd', views: 1})).toBe(20);
    statsStore.maxDailyViews$.next(1000);
    fixture.detectChanges();
    expect(component['barHeight']({date: 'd', views: 1})).toBe(4);
  });

  it('says so when there are no views', async () => {
    statsStore.stats$.next({...stats, totalViews: 0, viewsToday: 0, viewsLast7Days: 0, daily: [{date: '2026-11-21', views: 0}]});
    await create();
    expect(element.textContent).toContain('stats.empty');
  });

  it('shows the loading state only before the first numbers, and the error', async () => {
    statsStore.isLoading$.next(true);
    await create();
    expect(element.textContent).toContain('stats.loading');

    statsStore.stats$.next(stats);
    fixture.detectChanges();
    expect(element.textContent).not.toContain('stats.loading');

    statsStore.error$.next('forbidden');
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('stats.error');
  });

  it('reloads when another window is chosen', async () => {
    await create();
    statsStore.load.calls.reset();
    const buttons = Array.from(element.querySelectorAll('.stats-window')) as HTMLButtonElement[];
    expect(buttons.length).toBe(3);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');

    buttons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(statsStore.load).toHaveBeenCalledWith('b1', 7);
    expect((element.querySelectorAll('.stats-window')[0] as HTMLElement).classList).toContain('stats-window-active');
  });

  it('goes back to the settings', async () => {
    await create();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    (element.querySelector('.back-button') as HTMLElement).click();
    expect(navigate).toHaveBeenCalledWith(['/partner/settings']);
  });
});
