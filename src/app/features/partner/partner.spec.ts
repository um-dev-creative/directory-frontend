import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Partner } from './partner';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PartnerProfileService } from './services/partner-profile.service';
import { SessionStoreService } from '@app/core/store/session/session-store.service';
import { LoggerService } from '@app/core/services/logger.service';
import { BusinessStatsClient } from '@core/services/business/business-stats.client';
import { PartnerProfile } from 'assets/mocks/partner-profiles.mock';

const MOCK_PROFILE: PartnerProfile = {
  id: 42,
  slug: 'test-partner',
  name: 'Test Partner',
  logo: 'logo.png',
  description: 'Descripcion',
  shortDescription: 'Descripcion corta',
  benefits: [],
  categories: [],
  website: 'https://test.com',
  availableChannels: ['online'],
  rating: 4,
  reviewCount: 10,
  redemptionInstructions: 'Instrucciones',
  termsAndConditions: '',
  images: [],
  contact: { email: 'test@test.com' },
  offers: [],
  isBookmarked: false,
  status: 'active'
};

describe('Partner', () => {
  let component: Partner;
  let fixture: ComponentFixture<Partner>;
  let sessionSubject: BehaviorSubject<any>;
  let mockRouter: jasmine.SpyObj<Router>;
  let statsClient: jasmine.SpyObj<BusinessStatsClient>;

  beforeEach(async () => {
    sessionSubject = new BehaviorSubject<any>(null);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    statsClient = jasmine.createSpyObj<BusinessStatsClient>('BusinessStatsClient', ['recordView']);
    statsClient.recordView.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [Partner],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'test-partner' })),
            queryParams: of({}),
            params: of({ slug: 'test-partner' }),
            snapshot: { paramMap: convertToParamMap({ slug: 'test-partner' }) }
          }
        },
        {
          provide: PartnerProfileService,
          useValue: {
            getPartnerBySlug: () => of(MOCK_PROFILE),
            getSimilarPartners: () => of([])
          }
        },
        {
          provide: SessionStoreService,
          useValue: { session$: sessionSubject.asObservable() }
        },
        { provide: Router, useValue: mockRouter },
        { provide: BusinessStatsClient, useValue: statsClient },
        {
          provide: LoggerService,
          useValue: { debug: () => {}, error: () => {}, info: () => {} }
        },
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Partner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isOwner()', () => {
    it('should be true when the session includes the partner business id', () => {
      sessionSubject.next({ userAuth: { businesses: ['42'] } });
      fixture.detectChanges();
      expect(component['isOwner']()).toBeTrue();
    });

    it('should be false when the session does not include the partner business id', () => {
      sessionSubject.next({ userAuth: { businesses: ['99'] } });
      fixture.detectChanges();
      expect(component['isOwner']()).toBeFalse();
    });
  });

  describe('edit button visibility', () => {
    it('should show the edit button when isOwner() is true', () => {
      sessionSubject.next({ userAuth: { businesses: ['42'] } });
      fixture.detectChanges();
      const editBtn: HTMLElement = fixture.nativeElement.querySelector('[title="Editar perfil"]');
      expect(editBtn).not.toBeNull();
    });

    it('should hide the edit button when isOwner() is false', () => {
      sessionSubject.next({ userAuth: { businesses: [] } });
      fixture.detectChanges();
      const editBtn: HTMLElement = fixture.nativeElement.querySelector('[title="Editar perfil"]');
      expect(editBtn).toBeNull();
    });
  });

  describe('editPartner()', () => {
    it('should navigate to /partner/edit/:id', () => {
      component['editPartner']();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/partner/edit', MOCK_PROFILE.id]);
    });
  });

  describe('view counting (statistics)', () => {
    it('should not count a visit to a mock profile, whose id is a number', () => {
      expect(statsClient.recordView).not.toHaveBeenCalled();
    });

    it('should count one view of a real business (its id is a UUID)', () => {
      component['recordView']('7a1b2c3d-1111-4222-8333-444455556666');
      expect(statsClient.recordView).toHaveBeenCalledOnceWith('7a1b2c3d-1111-4222-8333-444455556666');
    });

    it('should ignore a failure of the counter', () => {
      statsClient.recordView.and.returnValue(throwError(() => new Error('down')));
      expect(() => component['recordView']('7a1b2c3d-1111-4222-8333-444455556666')).not.toThrow();
    });
  });
});
