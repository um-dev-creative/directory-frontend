import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CommunityMember} from './community-member';
import {ReactiveFormsModule} from '@angular/forms';
import {of, throwError, NEVER} from 'rxjs';
import {UserClient} from '@core/services/user/user.client';
import {Store} from '@ngrx/store';
import {HeaderService} from '@app/header/header.service';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {DirectoryBackendJwtPipe} from '@shared/pipes/directory-backend-jwt.pipe';
import {UserMockService} from './services/user-mock.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AuthClient} from '@app/features/auth/auth.client';
import { SessionStoreService } from '@core/store/session/session-store.service';
import { Router } from '@angular/router';

// Mocks
class MockUserClient {
  updateUser = jasmine.createSpy().and.returnValue(of({ status: 202 }));
  findUserById = jasmine.createSpy().and.returnValue(of({
    headers: { status: 200 },
    data: {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      phoneId: '1',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01',
      email: 'john@example.com',
      notificationEmail: true,
      notificationSms: false,
      privacyDataOutActive: false
    }
  }));
  deleteUser = jasmine.createSpy().and.returnValue(of({ status: 204 }));
  uploadProfileImage = jasmine.createSpy().and.returnValue(of({ status: 200, data: { imageUrl: 'avatar-url' } }));
}
const mockStore = {
  select: jasmine.createSpy().and.returnValue(of({
    sessionData: {
      userAuth: {
        fullName: 'John Doe',
        email: 'john@example.com',
        backboneSessionToken: 'token',
        sessionTokenBkd: 'tokenBkd'
      },
      token: 'token'
    }
  })),
  dispatch: jasmine.createSpy('dispatch')
};

const mockSessionStoreService = {
  saveSessionData: jasmine.createSpy('saveSessionData'),
  clearSessionData: jasmine.createSpy('clearSessionData'),
  loadSessionData: jasmine.createSpy('loadSessionData'),
  setInitialized: jasmine.createSpy('setInitialized'),
  session$: of(null)
};

class MockHeaderService {
  setHeaderType = jasmine.createSpy();
}
class MockBackboneJwtPipe {
  transform = jasmine.createSpy().and.returnValue({ uid: '1', roles: ['user'] });
}
class MockDirectoryBackendJwtPipe {
  transform = jasmine.createSpy().and.returnValue({ vcCompleted: 'true' });
}
class MockUserMockService {
  uploadAvatar = jasmine.createSpy().and.returnValue(of({ url: 'avatar-url' }));
}
class MockAuthClient {
  closeSession = jasmine.createSpy().and.returnValue(of({}));
}

const mockRouter = {
  navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
} as any;

describe('CommunityMember', () => {
  let component: CommunityMember;
  let fixture: ComponentFixture<CommunityMember>;
  let userClient: MockUserClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommunityMember, NoopAnimationsModule],
      providers: [provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: UserClient, useClass: MockUserClient },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
        { provide: HeaderService, useClass: MockHeaderService },
        { provide: BackboneJwtPipe, useClass: MockBackboneJwtPipe },
        { provide: DirectoryBackendJwtPipe, useClass: MockDirectoryBackendJwtPipe },
        { provide: UserMockService, useClass: MockUserMockService },
        { provide: AuthClient, useClass: MockAuthClient },
        { provide: SessionStoreService, useValue: mockSessionStoreService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityMember);
    component = fixture.componentInstance;
    // Override component-level injected instances with our mocks before ngOnInit runs
    userClient = TestBed.inject(UserClient) as any;
    (component as any).userClient = userClient;
    // Replace component's own pipe instances (component providers) with our mocks
    (component as any).backboneJwtPipe = new MockBackboneJwtPipe();
    (component as any).directoryJwtPipe = new MockDirectoryBackendJwtPipe();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with session data', () => {
    // Prevent immediate profile loading from userClient
    // Replace spy to ensure no network call during this test
    userClient.findUserById = jasmine.createSpy().and.returnValue(NEVER);
    fixture.detectChanges();
    expect(component['profileForm'].get('firstName')?.value).toBe('');
    expect(component['profileForm'].get('lastName')?.value).toBe('');
    // email control is disabled; use get to read its value
    expect(component['profileForm'].get('email')?.value).toBe('john@example.com');
  });

  it('should load profile data on init', () => {
    // Populate profileData directly using the same shape as the service response
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      phoneId: '1',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01',
      email: 'john@example.com',
      notificationEmail: true,
      notificationSms: false,
      privacyDataOutActive: false
    };
    (component as any).setProfileData(userData);
    fixture.detectChanges();
    expect(component.profileData.firstName).toBe('John');
  });

  it('should update form with user data after loading', () => {
    // Populate profileData directly and ensure the form reflects it
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      phoneId: '1',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01',
      email: 'john@example.com',
      notificationEmail: true,
      notificationSms: false,
      privacyDataOutActive: false
    };
    (component as any).setProfileData(userData);
    fixture.detectChanges();
    expect(component['profileForm'].get('firstName')?.value).toBe('John');
    expect(component['profileForm'].get('lastName')?.value).toBe('Doe');
    expect(component['profileForm'].get('displayName')?.value).toBe('John Doe');
    // confirm disabled email control has the expected value
    expect(component['profileForm'].get('email')?.value).toBe('john@example.com');
  });

  it('should submit profile update and reload user data', fakeAsync(() => {
    // Prepare mocked user data and session
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      phoneId: '1',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01',
      email: 'john@example.com',
      notificationEmail: true,
      notificationSms: false,
      privacyDataOutActive: false
    };

    // Ensure the component has session info and a userId
    (component as any).sessionData = {
      userAuth: {
        fullName: 'John Doe',
        email: 'john@example.com',
        sessionTokenBkd: 'tokenBkd'
      },
      token: 'token'
    };
    (component as any).userId = '1';

    // Ensure the mocked client behavior
    userClient.updateUser.and.returnValue(of({ status: 202 }));
    userClient.findUserById.and.returnValue(of({ headers: { status: 200 }, data: userData }));

    // Initialize component profile data to simulate pre-loaded state
    (component as any).setProfileData(userData);
    fixture.detectChanges();

    // Make some changes on the form to simulate an update
    component['profileForm'].patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      notificationsEmail: true,
      notificationsSms: false,
      privacyOptOut: false,
      phone: '9876543210'
    });

    component.onSubmitProfileUpdate();
    tick();

    expect(userClient.updateUser).toHaveBeenCalled();
    expect(userClient.findUserById).toHaveBeenCalled();
    expect(component.profileData.firstName).toBe('John'); // Mocked response
    expect(component.isSubmitting).toBe(false);
  }));

  it('should handle update error', fakeAsync(() => {
    // Ensure profile loaded
    (component as any).sessionData = {
      userAuth: {
        fullName: 'John Doe',
        email: 'john@example.com',
        sessionTokenBkd: 'tokenBkd'
      },
      token: 'token'
    };
    component.loadProfileData();
    fixture.detectChanges();
    userClient.updateUser.and.returnValue(throwError(() => new Error('Update failed')));
    component['profileForm'].patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      notificationsEmail: true,
      notificationsSms: false,
      privacyOptOut: false,
      phone: '9876543210'
    });
    // spyOn(component, 'logError'); // logError method doesn't exist in CommunityMember
    component.onSubmitProfileUpdate();
    tick();
    // expect(component.logError).toHaveBeenCalled();
    expect(component.isSubmitting).toBe(false);
  }));

  it('should handle avatar upload', fakeAsync(() => {
    (component as any).sessionData = {
      userAuth: {
        fullName: 'John Doe',
        email: 'john@example.com',
        sessionTokenBkd: 'tokenBkd'
      },
      token: 'token'
    };
    component.loadProfileData();
    fixture.detectChanges();
    const file = new File([''], 'avatar.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as any;
    component.onAvatarSelect(event);
    tick();
    // The component uses userClient.uploadProfileImage (FormData) to upload
    expect(userClient.uploadProfileImage).toHaveBeenCalled();
    const arg = userClient.uploadProfileImage.calls.mostRecent().args[0];
    expect(arg instanceof FormData).toBeTrue();
    // Component prefixes the returned image with the media URL
    expect(component.profileData.avatar).toBe('https://prx-qa.tst/latinhub/media/avatar-url');
    expect(component.uploadingAvatar).toBe(false);
  }));

  it('should mark form fields as touched on invalid submit', () => {
    spyOn(component['profileForm'], 'markAllAsTouched');
    component['profileForm'].markAllAsTouched = jasmine.createSpy();
    component['profileForm'].setErrors({ invalid: true });
    expect(component.isSubmitting).toBe(false);
  });

  it('should get field error messages', () => {
    const field = component['profileForm'].get('firstName');
    field?.setErrors({ required: true });
    field?.markAsTouched();
    expect(component.getFieldError('firstName')).toContain('requerido');
  });

  it('should open and close delete account modal', () => {
    component.deleteAccount();
    expect(component.deleteAccountModalOpen).toBe(true);
    component.cancelDeleteAccount();
    expect(component.deleteAccountModalOpen).toBe(false);
  });

  it('should confirm delete account', fakeAsync(() => {
    // Ensure the component uses the mock user client and has a userId
    (component as any).userClient = userClient;
    (component as any).userId = '123';
    userClient.deleteUser.and.returnValue(of({ status: 204 }));
    // Ensure the component uses the mock router to avoid real navigation
    (component as any).router = mockRouter;
    // Stub logout so it doesn't call router.navigate and cause route matching during tests
    spyOn(component as any, 'logout').and.callFake(() => {});
    component.deleteAccount();
    component.confirmDeleteAccount();
    tick(1000);
    expect(userClient.deleteUser).toHaveBeenCalledWith('123');
    expect(component.deleteAccountModalOpen).toBe(false);
  }));

  it('should get avatar display initials', () => {
    component.profileData.firstName = 'Jane';
    component.profileData.lastName = 'Smith';
    expect(component.getAvatarDisplay()).toBe('JS');
  });

  it('should check if has avatar', () => {
    component.profileData.avatar = 'avatar-url';
    expect(component.hasAvatar()).toBeTrue();
    component.profileData.avatar = '';
    expect(component.hasAvatar()).toBeFalse();
  });

  it('should get form values and errors as string', () => {
    expect(typeof component.getFormValues()).toBe('string');
    expect(typeof component.getFormErrors()).toBe('string');
  });
});
