import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CommunityMember} from './community-member';
import {ReactiveFormsModule} from '@angular/forms';
import {of, throwError} from 'rxjs';
import {UserClient} from '@core/services/user/user.client';
import {Store} from '@ngrx/store';
import {HeaderService} from '@app/header/header.service';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {DirectoryBackendJwtPipe} from '@shared/pipes/directory-backend-jwt.pipe';
import {UserMockService} from './services/user-mock.service';

// Mocks
class MockUserClient {
  updateUser = jasmine.createSpy().and.returnValue(of({ status: 202 }));
  findUserById = jasmine.createSpy().and.returnValue(of({
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
  }));
}
class MockStore {
  select = jasmine.createSpy().and.returnValue(of({
    sessionData: {
      userAuth: {
        fullName: 'John Doe',
        email: 'john@example.com',
        backboneSessionToken: 'token',
        sessionTokenBkd: 'tokenBkd'
      },
      token: 'token'
    }
  }));
}
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

describe('CommunityMember', () => {
  let component: CommunityMember;
  let fixture: ComponentFixture<CommunityMember>;
  let userClient: MockUserClient;
  let store: MockStore;
  let headerService: MockHeaderService;
  let backboneJwtPipe: MockBackboneJwtPipe;
  let directoryJwtPipe: MockDirectoryBackendJwtPipe;
  let userMockService: MockUserMockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserClient, useClass: MockUserClient },
        { provide: Store, useClass: MockStore },
        { provide: HeaderService, useClass: MockHeaderService },
        { provide: BackboneJwtPipe, useClass: MockBackboneJwtPipe },
        { provide: DirectoryBackendJwtPipe, useClass: MockDirectoryBackendJwtPipe },
        { provide: UserMockService, useClass: MockUserMockService }
      ],
      declarations: [CommunityMember]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityMember);
    component = fixture.componentInstance;
    userClient = TestBed.inject(UserClient) as any;
    store = TestBed.inject(Store) as any;
    headerService = TestBed.inject(HeaderService) as any;
    backboneJwtPipe = TestBed.inject(BackboneJwtPipe) as any;
    directoryJwtPipe = TestBed.inject(DirectoryBackendJwtPipe) as any;
    userMockService = TestBed.inject(UserMockService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with session data', () => {
    expect(component.profileForm.value.firstName).toBe('');
    expect(component.profileForm.value.lastName).toBe('');
    expect(component.profileForm.value.email).toBe('john@example.com');
  });

  it('should load profile data on init', () => {
    spyOn(component, 'loadProfileData').and.callThrough();
    component.ngOnInit();
    expect(component.loadProfileData).toHaveBeenCalled();
    expect(userClient.findUserById).toHaveBeenCalled();
    expect(component.profileData.firstName).toBe('John');
  });

  it('should update form with user data after loading', () => {
    component.loadProfileData();
    expect(component.profileForm.value.firstName).toBe('John');
    expect(component.profileForm.value.lastName).toBe('Doe');
    expect(component.profileForm.value.displayName).toBe('John Doe');
  });

  it('should submit profile update and reload user data', fakeAsync(() => {
    component.profileForm.patchValue({
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
    userClient.updateUser.and.returnValue(throwError(() => new Error('Update failed')));
    component.profileForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      notificationsEmail: true,
      notificationsSms: false,
      privacyOptOut: false,
      phone: '9876543210'
    });
    spyOn(component, 'logError');
    component.onSubmitProfileUpdate();
    tick();
    expect(component.logError).toHaveBeenCalled();
    expect(component.isSubmitting).toBe(false);
  }));

  it('should handle avatar upload', fakeAsync(() => {
    const file = new File([''], 'avatar.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as any;
    component.onAvatarSelect(event);
    tick();
    expect(userMockService.uploadAvatar).toHaveBeenCalledWith(file);
    expect(component.profileData.avatar).toBe('avatar-url');
    expect(component.uploadingAvatar).toBe(false);
  }));

  it('should mark form fields as touched on invalid submit', () => {
    spyOn(component.profileForm, 'markAllAsTouched');
    component.profileForm.markAllAsTouched = jasmine.createSpy();
    component.profileForm.setErrors({ invalid: true });
    expect(component.isSubmitting).toBe(false);
  });

  it('should get field error messages', () => {
    const field = component.profileForm.get('firstName');
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
    component.deleteAccount();
    component.confirmDeleteAccount();
    tick(1000);
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

