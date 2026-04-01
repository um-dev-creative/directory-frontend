/**
 * CommunityMember Component
 *
 * This component manages the user profile view and update functionality for community members.
 * It provides a reactive form for editing user profile data, handles avatar uploads, and manages account deletion.
 *
 * Main Features:
 * - Loads and displays user profile data from the backend.
 * - Allows users to update their profile information (name, display name, phone, notification preferences, privacy opt-out).
 * - Handles avatar upload and preview.
 * - Provides a modal for account deletion confirmation.
 * - Integrates with the session store to keep profile data in sync with authentication state.
 * - Uses RxJS for asynchronous operations and state management.
 *
 * Key Methods:
 * - ngOnInit: Initializes the component, loads session and profile data.
 * - loadProfileData: Fetches user profile data from the backend.
 * - onSubmitProfileUpdate: Submits updated profile data and reloads the user profile.
 * - onAvatarSelect: Handles avatar file selection and upload.
 * - deleteAccount/cancelDeleteAccount/confirmDeleteAccount: Manage account deletion modal and logic.
 * - getFieldError/getFieldVariant: Helpers for form validation and error display.
 *
 * Dependencies:
 * - Angular ReactiveFormsModule for form handling.
 * - NgRx Store for session state.
 * - UserClient for backend API calls.
 * - UserMockService for avatar upload simulation.
 * - HeaderService for UI header management.
 * - BackboneJwtPipe and DirectoryBackendJwtPipe for JWT parsing.
 *
 * Usage:
 * <app-community-member></app-community-member>
 *
 * Author: [Your Name or Team]
 * Date: [2025-06-24]
 */

import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {Store} from '@ngrx/store';
import {HeaderService} from '@app/header/header.service';
import {HeaderType} from '@shared/constants/header-type';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import {Avatar, Button, CardComponent, InputComponent, ModalComponent, SkeletonComponent} from '@app/components/ui';
import {Subject, takeUntil} from 'rxjs';
import {ReportProblem, ReportProblemOptions} from '@app/layout/report-problem/report-problem';
import {UserClient} from '@core/services/user/user.client';
import {DirectoryBackendJwtPipe} from '@shared/pipes/directory-backend-jwt.pipe';
import {switchMap} from 'rxjs/operators';
import {NotificationService} from '@app/core/services';
import {UserDetailUpdateRequest} from '@shared/models/user-detail-update-request';
import {ProfileData} from '@shared/models/profile-data.model';
import {AuthClient} from '@app/features/auth/auth.client';
import {SessionStoreService} from '@core/store/session/session-store.service';
import {DFC} from '@shared/constants/app.const';
import {Router} from '@angular/router';
import {LoggerService} from '@app/core/services/logger.service';
import {getInitials} from '@shared/utils/get-initials.helper';
import { environment } from '@env/environment';

@Component({
  selector: 'app-community-member',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputComponent, Avatar, ReportProblem, CardComponent, ModalComponent, SkeletonComponent],
  templateUrl: './community-member.html',
  animations: [],
  providers: [BackboneJwtPipe, DirectoryBackendJwtPipe]
})
export class CommunityMember implements OnInit, OnDestroy {
  protected readonly isProd = environment.production;
  /** Pipe to decode Backbone JWT */
  private readonly backboneJwtPipe: BackboneJwtPipe = inject(BackboneJwtPipe);
  /** Pipe to decode Directory Backend JWT */
  private readonly directoryJwtPipe: DirectoryBackendJwtPipe = inject(DirectoryBackendJwtPipe);

  /** Client service for authentication-related API calls */
  private readonly authClient: AuthClient = inject(AuthClient);
  /** Client service for user-related API calls */
  private readonly userClient = inject(UserClient);
  /** Service to manage the UI header */
  private readonly headerService: HeaderService = inject(HeaderService);
  /** Service for displaying notifications */
  private readonly notificationService: NotificationService = inject(NotificationService);
  /** Service to manage session state */
  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);

  /** Store for session state */
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  /** Reactive form for user profile */
  protected profileForm!: FormGroup;
  private readonly formBuilder = inject(FormBuilder);
  /** Subject to manage component destruction */
  private readonly destroy$ = new Subject<void>();
  /** Change detector reference for manual change detection */
  private readonly changeDetectorRefs = inject(ChangeDetectorRef);
  /** Router for navigation */
  private readonly router: Router = inject(Router);
  private readonly logger = inject(LoggerService);

  /** Session data from the store */
  protected sessionData: SessionData | undefined;
  /** Indicates if the user is authenticated */
  protected isAuthenticated = false;
  /** Full name of the user */
  protected userFullName: string | undefined;
  /** Preview URL for the avatar image */
  protected avatarPreview: string | null = null;
  /** Indica si la página está en estado de carga inicial */
  isLoading = true;
  /** Indicates if the form is currently submitting */
  isSubmitting = false;
  /** Indicates if an avatar is being uploaded */
  uploadingAvatar = false;
  /** Indicates if the delete account modal is open */
  deleteAccountModalOpen = false;

  /** User ID and roles for the current user */
  private userId: string = '';
  /** Roles assigned to the user */
  private roles: [] = [];
  // Opciones para el componente ReportProblem
  protected reportProblemOptions: ReportProblemOptions = {};

  // Mock data para el perfil
  profileData: ProfileData = {
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    phoneId: '',
    phone: '',
    birthDate: {
      month: '',
      day: '',
      year: ''
    },
    // avatar: null,
    avatar: '',
    emailConfirmed: true,
    privacyOptOut: false,
    notifications: {
      email: true,
      sms: false
    }
  };

  /**
   * Constructor for the CommunityMember component.
   * Initializes logging functions and sets up the profile form.
   */
  constructor() {
    // use injected logger
    this.initializeForm();
  }

  /**
   * Initializes the component, subscribes to session state, loads profile data, and sets up the UI header.
   */
  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      if (this.sessionData.userAuth?.fullName) {
        this.isAuthenticated = true;
        this.userFullName = this.sessionData.userAuth.fullName;
        // Usar datos reales si están disponibles
        this.profileData.displayName = this.sessionData.userAuth.fullName;
        this.profileData.email = this.sessionData.userAuth.email || this.profileData.email;
        // Actualizar el formulario con los nuevos datos
        this.updateFormWithSessionData();
      } else {
        this.isAuthenticated = false;
        this.userFullName = undefined;
      }
      // Log de la información de usuario disponible
      this.logger.info('User session data:', this.sessionData);
      this.logger.debug('Profile data:', this.profileData);

      // Actualizar opciones del componente ReportProblem
      this.updateReportProblemOptions();
    });
    this.loadProfileData();
    this.processSessionData();
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads the user profile data from the backend and updates the form.
   */
  loadProfileData(): void {
    this.userId = this.backboneJwtPipe.transform(this.sessionData?.userAuth?.sessionTokenBkd ?? "")?.uid ?? "";
    this.roles = this.backboneJwtPipe.transform(this.sessionData?.userAuth?.sessionTokenBkd ?? "")?.roles ?? [];

    if (this.userId && this.userId !== '' && this.roles && this.roles.length > 0) {
      this.userClient.findUserById(this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            if (!response.headers.status || response.headers.status !== 200) {
              this.logger.error('Unexpected response status:', response.status);
              this.isLoading = false;
              return;
            }
            this.setProfileData(response.data);
            this.updateFormWithSessionData();
            this.isLoading = false;
            this.logger.info('Profile data loaded:', this.profileData);
          },
          error: (error: any) => {
            this.logger.error('Error loading profile data:', error);
            this.isLoading = false;
          }
        });
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Returns the initials of the user's first and last name for avatar display.
   */
  getAvatarDisplay(): string {
    return getInitials(this.profileData.firstName ?? '', this.profileData.lastName ?? '');
  }

  /**
   * Returns true if the user has an avatar image set.
   */
  hasAvatar(): boolean {
    return !!(this.profileData.avatar && this.profileData.avatar.trim() !== '');
  }

  /**
   * Handles avatar file selection, previews the image, and uploads it.
   * @param event File input change event
   */
  onAvatarSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.uploadingAvatar = true;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      // Upload file using FormData
      const formData = new FormData();
      formData.append('imageData', file, file.name);

      this.userClient.uploadProfileImage(formData).pipe(
        takeUntil(this.destroy$)).subscribe({
        next: (response: any) => {
          if (response.status !== 200) {
            throw new Error('Failed to upload avatar');
          }
          // Update profile data with new avatar URL
          this.profileData.avatar = 'https://prx-qa.tst/latinhub/media/' + response.data.imageUrl;
          this.uploadingAvatar = false;
        },
        error: (err) => {
          this.logger.error('Error uploading avatar:', err);
          this.uploadingAvatar = false;
        }
      });
    }
  }

  // Métodos para el formulario reactivo
  /**
   * Returns the variant for a form field ('default' or 'error') based on its validation state.
   * @param fieldName Name of the form field
   */
  protected getFieldVariant(fieldName: string): 'default' | 'error' {
    const field = this.profileForm.get(fieldName);
    return field && field.invalid && (field.dirty || field.touched) ? 'error' : 'default';
  }

  /**
   * Returns the error message for a form field if it is invalid and touched.
   * @param fieldName Name of the form field
   */
  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['email']) {
        return 'Formato de email inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  /**
   * Submits the profile update form for the user. Validates the form, sends the update request
   * to the server, and processes the response. If the update is successful, fetches the updated
   * user data and updates the local profile data and form. Displays success or error notifications
   * based on the result of the operation.
   *
   * @return {void} This method does not return any value, it performs side-effects such as sending
   *                 network requests, updating the profile data, and triggering notifications.
   */
  onSubmitProfileUpdate(): void {
    if (this.profileForm.invalid) return;
    this.isSubmitting = true;
    const updateRequest = this.getUserUpdateRequest();
    if (this.userId) {
      this.userClient.updateUser(this.userId, updateRequest)
        .pipe(
          takeUntil(this.destroy$),
          switchMap((response) => {
            if (response.status === 202) {
              // Only fetch updated data if update was accepted
              return this.userClient.findUserById(this.userId);
            } else {
              throw new Error('Update not accepted');
            }
          })
        )
        .subscribe({
          next: (userData: any) => {
            // userData may be either the raw data object or a response wrapper { headers, data }
            const data = userData?.data ? userData.data : userData;
            // Update local profile data and form
            this.setProfileData(data);
            this.updateFormWithSessionData();
            this.isSubmitting = false;
            this.notificationService.success('User updated successfully');
          },
          error: (err) => {
            this.logger.error('Failed to update or reload user', err);
            this.isSubmitting = false;
          }
        });
    }
  }

  /**
   * Initiates the process of deleting a user account by opening a confirmation modal.
   *
   * @return {void} This method does not return any value.
   */
  deleteAccount(): void {
    this.deleteAccountModalOpen = true;
  }

  /**
   * Confirms the deletion of a user's account by invoking a service to handle the account removal process.
   * It provides success and error notifications based on the operation's result and manages the state of the deletion modal.
   *
   * @return {void} No return value. The method performs side effects such as logging, state updates, and triggering notifications.
   */
  confirmDeleteAccount(): void {
    this.logger.info('Account deletion confirmed');

    this.userClient.deleteUser(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: any) => {
          if (response?.status === 204) {
            this.notificationService.success('Account deleted successfully');
            // Clear session data and redirect to the home page
            this.logout();
          } else {
            this.notificationService.error('Failed to delete account');
          }
          this.deleteAccountModalOpen = false;
        },
        error: (error: any) => {
          this.logger.error('Error deleting account:', error);
          this.deleteAccountModalOpen = false;
          this.notificationService.error('Error deleting account');
        }
      }
    )
  }

  /**
   * Cancels the account deletion process by closing the delete account modal.
   *
   * @return {void} Does not return any value.
   */
  cancelDeleteAccount(): void {
    this.deleteAccountModalOpen = false;
  }

  /**
   * Retrieves the current values of a profile form as a JSON string.
   *
   * @return {string} The stringified JSON representation of the form values, formatted with two spaces for readability.
   */
  getFormValues(): string {
    return JSON.stringify(this.profileForm.value, null, 2);
  }

  /**
   * Retrieves and formats the validation errors of all controls
   * in the profile form as a JSON string.
   *
   * @return {string} A JSON string representing the validation errors
   *                  of the form controls, with each control's key
   *                  associated with its respective errors. Returns an
   *                  empty JSON string if there are no errors.
   */
  getFormErrors(): string {
    const errors: any = {};
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return JSON.stringify(errors, null, 2);
  }

  /**
   * Constructs a user update request object by extracting values from a profile form and additional properties.
   *
   * @return {UserDetailUpdateRequest} An object containing updated user details such as first name,
   * last name, display name, notification preferences, privacy options, phone information, role IDs, and active status.
   */
  getUserUpdateRequest(): UserDetailUpdateRequest {
    const formValue = this.profileForm.getRawValue();
    const tempRole = this.roles.toString().substring(1, this.roles.toString().length - 1);
    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      displayName: formValue.displayName,
      notificationEmail: formValue.notificationsEmail,
      notificationSms: formValue.notificationsSms,
      privacyDataOutActive: formValue.privacyOptOut,
      phoneId: this.profileData.phoneId ?? '',
      phoneNumber: formValue.phone ?? '',
      roleIds: [tempRole],
      active: 'true'
    };
  }

  /**
   * Updates the profile data object with the provided data.
   *
   * @param {Object} data - The data object containing profile details.
   * @param {string} data.firstName - The first name of the user.
   * @param {string} data.lastName - The last name of the user.
   * @param {string} [data.displayName] - The display name of the user. If not provided, it will default to a combination of the first and last names.
   * @param {string} data.phoneId - The phone ID associated with the user.
   * @param {string} [data.phoneNumber] - The phone number of the user. Defaults to an empty string if not provided.
   * @param {Object} [data.dateOfBirth] - The date of birth of the user. If not provided or invalid, defaults to an object with empty month, day, and year values.
   * @param {string} data.email - The email address of the user.
   * @param {boolean} [data.notificationEmail=false] - Indicates if email notifications are enabled. Defaults to false.
   * @param {boolean} [data.notificationSms=false] - Indicates if SMS notifications are enabled. Defaults to false.
   * @param {boolean} [data.privacyDataOutActive=false] - Specifies if privacy opt-out is active. Defaults to false.
   *
   * @return {void} This method does not return a value.
   */
  setProfileData(data: any): void {
    // Default avatar if not provided
    const avatar = data.profileImageRef ? `https://prx-qa.tst/latinhub/media/${data.profileImageRef}` : this.profileData.avatar;
    this.profileData.firstName = data.firstName;
    this.profileData.lastName = data.lastName;
    this.profileData.displayName = data.displayName ?? `${data.firstName} ${data.lastName}`;
    this.profileData.phoneId = data.phoneId;
    this.profileData.phone = data.phoneNumber ?? '';
    this.profileData.birthDate = this.parseDateOfBirth(data.dateOfBirth) ?? {month: '', day: '', year: ''};
    this.profileData.email = data.email;
    this.profileData.avatar = avatar;
    this.profileData.emailConfirmed = this.directoryJwtPipe.transform(this.sessionData?.userAuth?.sessionToken ?? "")?.vcCompleted == 'true' || false;
    this.profileData.notifications = {
      email: data.notificationEmail ?? false,
      sms: data.notificationSms ?? false
    };
    this.profileData.privacyOptOut = data.privacyDataOutActive ?? false;
    this.updateFormWithSessionData();
  }

  /**
   * Sets the UI header type based on the session state.
   */
  private processSessionData(): void {
    if (this.sessionData?.token) {
      this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

  /**
   * Updates the form with the current profileData values.
   */
  private updateFormWithSessionData(): void {
    this.profileForm.patchValue({
      firstName: this.profileData.firstName,
      lastName: this.profileData.lastName,
      phone: this.profileData.phone,
      notificationsEmail: this.profileData.notifications.email,
      notificationsSms: this.profileData.notifications.sms,
      privacyOptOut: this.profileData.privacyOptOut,
      birthDate: `${this.profileData.birthDate.day}/${this.profileData.birthDate.month}/${this.profileData.birthDate.year}`,
      email: this.profileData.email,
      displayName: this.profileData.displayName
    });
  }

  /**
   * Parses a date string in the format "YYYY-MM-DD" and returns an object containing the month, day, and year.
   *
   * @param {string} dateString - The date string to parse in the format "YYYY-MM-DD".
   * @return {{month: string, day: string, year: string} | null} An object with the parsed month, day, and year, or null if the input is invalid.
   */
  private parseDateOfBirth(dateString: string): { month: string, day: string, year: string } | null {
    if (!dateString) return null;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const [year, month, day] = dateString.split('-');
    const monthIndex = Number.parseInt(month, 10) - 1;
    return {
      month: months[monthIndex] || '',
      day: day,
      year: year
    };
  }

  /**
   * Updates the configuration object for reporting problems.
   * This method populates the `reportProblemOptions` object with the user's email, display name,
   * form validation status, avatar information, authentication status, and a customizable Google Form URL.
   *
   * @return {void} This method does not return any value.
   */
  private updateReportProblemOptions(): void {
    this.reportProblemOptions = {
      userEmail: this.profileData.email,
      userDisplayName: this.profileData.displayName,
      contextData: {
        formStatus: this.profileForm?.valid ? 'valid' : 'invalid',
        hasAvatar: this.hasAvatar(),
        isAuthenticated: this.isAuthenticated
      },
      // Puedes personalizar la URL del Google Form aquí
      googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=CommunityMemberProfile'
    };
  }

  /**
   * Initializes the profile form with default values and validation rules.
   * Populates the form fields with the data from `this.profileData`. Some fields
   * are prefilled and disabled based on the given data.
   *
   * Validation rules include checks for required fields, minimum lengths, and proper email format.
   *
   * @return {void} This method does not return a value.
   */
  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      email: [{value: this.profileData.email, disabled: true}, [Validators.required, Validators.email]],
      firstName: [this.profileData.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.profileData.lastName, [Validators.required, Validators.minLength(2)]],
      displayName: [this.profileData.displayName, [Validators.required, Validators.minLength(2)]],
      phone: [this.profileData.phone],
      birthDate: [{
        value: `${this.profileData.birthDate.day}/${this.profileData.birthDate.month}/${this.profileData.birthDate.year}`,
        disabled: true
      }],
      notificationsEmail: [this.profileData.notifications.email],
      notificationsSms: [this.profileData.notifications.sms],
      privacyOptOut: [this.profileData.privacyOptOut]
    });
  }

  private logout(): void {
    // Cambiar el header y navegar después de que los efectos de limpiar la sesión se completen
    this.authClient.closeSession(this.sessionData?.userAuth?.sessionTokenBkd).subscribe({
      next: () => this.logger.info('User logged out successfully'),
      error: (error) => this.logger.error('Error logging out:', error)
    });
    this.sessionStoreService.clearSessionData();
    this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    this.logger.info('User logged out');
    this.router.navigate([DFC.RelativePath.STAGE_PATH]);
  }
}
