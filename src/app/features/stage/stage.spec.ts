import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Stage} from './stage';
import {Store} from '@ngrx/store';
import {HeaderService} from '@app/header/header.service';
import {ChangeDetectorRef} from '@angular/core';
import {CardImage} from '@app/cards/services/cards.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { BannerService } from '@app/banner/services/banner.service';
import { CardsService } from '@app/cards/services/cards.service';
import { of } from 'rxjs';

// Mocks
class MockHeaderService {
  setHeaderType = jasmine.createSpy();
}
class MockChangeDetectorRef {
  detectChanges = jasmine.createSpy();
}
class MockStore {
  select = jasmine.createSpy().and.returnValue({
    subscribe: (fn: (state: any) => void) => fn({ sessionData: { userAuth: { fullName: 'Test User' }, token: 'token' } })
  });
  dispatch = jasmine.createSpy('dispatch');
}

const mockBannerData = {
  title: 'Test Banner',
  categories: [],
  banners: {}
};

class MockBannerService {
  getBannerData() {
    return of(mockBannerData);
  }
  clearCache() {}
}

const mockCardsData = [
  { src: 'a.jpg', alt: 'A', id: '1', title: 'Card A' }
];

class MockCardsService {
  getCards() {
    return of(mockCardsData);
  }
  clearCache() {}
}

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  events: of({})
} as any;

const mockActivatedRoute = {
  paramMap: of(convertToParamMap({})),
  queryParams: of({}),
  snapshot: { paramMap: convertToParamMap({}) }
};

describe('Stage', () => {
  let component: Stage;
  let fixture: ComponentFixture<Stage>;
  let headerService: MockHeaderService;
  let store: MockStore;
  let changeDetectorRef: MockChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stage, HttpClientTestingModule],
      providers: [
        { provide: CardsService, useClass: MockCardsService },
        { provide: BannerService, useClass: MockBannerService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeaderService, useClass: MockHeaderService },
        { provide: Store, useClass: MockStore },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Stage);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService) as any;
    store = TestBed.inject(Store) as any;
    changeDetectorRef = TestBed.inject(ChangeDetectorRef) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAuthenticated to true if user is authenticated', () => {
    component.ngOnInit();
    expect(component.isAuthenticated).toBeTrue();
  });

  it('should set isAuthenticated to false if user is not authenticated', () => {
    spyOn(store, 'select').and.returnValue({
      subscribe: (fn: (state: any) => void) => fn({ sessionData: {} })
    });
    component.ngOnInit();
    expect(component.isAuthenticated).toBeFalse();
  });

  it('should call setHeaderType with USER_AUTH_HEADER if token exists', () => {
    component.sessionData = { token: 'token', userAuth: { fullName: 'Test User' } } as any;
    component['processSessionData']();
    expect(headerService.setHeaderType).toHaveBeenCalledWith('USER_AUTH_HEADER');
  });

  it('should call setHeaderType with GENERAL_HEADER if token does not exist', () => {
    component.sessionData = { userAuth: { fullName: 'Test User' } } as any;
    component['processSessionData']();
    expect(headerService.setHeaderType).toHaveBeenCalledWith('GENERAL_HEADER');
  });

  it('should call detectChanges after processing session data', () => {
    component.sessionData = { token: 'token', userAuth: { fullName: 'Test User' } } as any;
    component['processSessionData']();
    expect(changeDetectorRef.detectChanges).toHaveBeenCalled();
  });

  it('should log card click event', () => {
    spyOn(console, 'log');
    const card: CardImage = { title: 'Card Title', alt: 'Alt', src: '', id: '1' } as any;
    component.onCardClick({ card, index: 2 });
    expect(console.log).toHaveBeenCalledWith('Card clicked:', 'Card Title', 'at position', 2);
  });

  it('should log image error event', () => {
    spyOn(console, 'warn');
    const card: CardImage = { title: 'Card Title', alt: 'Alt', src: '', id: '1' } as any;
    component.onImageError({ card, index: 1 });
    expect(console.warn).toHaveBeenCalledWith('Failed to load image for card:', 'Card Title');
  });
});
