import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { VerifyCode } from './verify-code';
import { provideLocationMocks } from '@angular/common/testing';
import { LoadingService } from '@app/core/services/loading.service';
import { BackboneJwtPipe } from '@shared/pipes/backbone-jwt.pipe';
import { NotificationService } from '@app/core/services/notification.service';
import { HeaderService } from '@app/header/header.service';
import { VerifyCodeClient } from './verify-code-client.service';
import { SessionStoreService } from '@app/core/store/session/session-store.service';
import { Router } from '@angular/router';

// Minimal stubs for injected services
const mockLoadingService: Partial<LoadingService> = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
const mockJwtPipe: Partial<BackboneJwtPipe> = { transform: jasmine.createSpy('transform').and.returnValue({ uid: '123' }) } as any;
const mockNotificationService: Partial<NotificationService> = { success: jasmine.createSpy('success'), error: jasmine.createSpy('error') } as any;
const mockHeaderService: Partial<HeaderService> = { setHeaderType: jasmine.createSpy('setHeaderType') } as any;
const mockVerifyCodeClient: Partial<VerifyCodeClient> = { confirmCode: jasmine.createSpy('confirmCode').and.returnValue({ pipe: () => ({ subscribe: () => {} }) }) } as any;
const mockSessionStoreService: Partial<SessionStoreService> = {} as any;
const mockRouter: Partial<Router> = { navigate: jasmine.createSpy('navigate') } as any;

describe('VerificationCodeComponent', () => {
  let component: VerifyCode;
  let fixture: ComponentFixture<VerifyCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyCode],
      providers: [
        provideMockStore({ initialState: { session: { sessionData: null } } }),
        provideLocationMocks(),
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: BackboneJwtPipe, useValue: mockJwtPipe },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: HeaderService, useValue: mockHeaderService },
        { provide: VerifyCodeClient, useValue: mockVerifyCodeClient },
        { provide: SessionStoreService, useValue: mockSessionStoreService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
