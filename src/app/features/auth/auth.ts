// Angular Core
import {AfterViewInit, ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Spinner} from '@app/shared/components/spinner/spinner';
//import {Store} from '@ngrx/store';
import {concatMap, Observable, of, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {LoadingService} from '@app/core/services/loading.service';
import {NotificationService} from '@app/core/services/notification.service';
import {ReportProblem, ReportProblemOptions} from '@app/layout/report-problem/report-problem';
// App Store
import {SessionData, UserAuth} from '@app/core/store/session/session.state';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
// App Components & Services
import {AuthClient} from './auth.client';
import {HeaderService} from '@app/header/header.service';
import {UserClient} from '@core/services/user/user.client';
// Shared
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {DFC} from '@app/shared/constants/app.const';
import {HeaderType} from '@shared/constants/header-type';
import {INITIAL_LOGIN_DATA, LoginData} from '@shared/models/login-data.model';
import {User} from '@shared/models/register-user.model';
// Assets
import {countries, Country, Month, months} from 'assets/data/common';
// Auth Services
import {AuthValidationService} from './services/auth-validation.service';
import {AuthFormService} from './services/auth-form.service';
import {PlaceholderService} from './services/placeholder.service';
// Auth Models
import {RegisterData} from './models/register-data.interface';
import {DropdownState} from './models/dropdown-state.interface';
import {AuthPlaceholders} from './models/auth-placeholders.interface';
// Auth Constants
import {DEFAULT_COUNTRY_CODE, INITIAL_DROPDOWN_STATE, INITIAL_PLACEHOLDERS} from './auth.constants';
import {DirectoryBackendJwtPipe} from '@shared/pipes/directory-backend-jwt.pipe';
import {AlertComponent, Button, SocialLoginButton, SocialProvider} from '@app/components/ui';
import {LoggerService} from '@app/core/services/logger.service';
import {getInitials} from '@shared/utils/get-initials.helper';

/**
 * Component for handling user authentication.
 */
@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule, Spinner, AlertComponent, SocialLoginButton, Button, ReportProblem],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  providers: [BackboneJwtPipe, DirectoryBackendJwtPipe]
})
export class Auth implements OnDestroy, OnInit, AfterViewInit {
    // Opciones para el componente ReportProblem
  protected reportProblemOptions: ReportProblemOptions = {};

  // Servicios inyectados
  private readonly authValidationService = inject(AuthValidationService);
  private readonly authFormService = inject(AuthFormService);
  private readonly placeholderService = inject(PlaceholderService);

  /**
   * User client services
   * @type {UserClient}
   */
  private readonly userClient: UserClient = inject(UserClient);

  /**
   * Subject for unsubscribing from observables
   * @type {Subject<void>}
   */
  private readonly subject$: Subject<void> = new Subject<void>();

  /**
   * User client services
   * @type {AuthClient}
   */
  private readonly authClient: AuthClient = inject(AuthClient);

  /**
   * Partner services for session data management
   * @type {Store<{ session: SessionData }>}
   */
  // private readonly store: Store<{ session: SessionData }> = inject(Store);

  /**
   * Header services for changing the header type
   * @type {HeaderService}
   */
  private readonly headerService: HeaderService = inject(HeaderService);

  private readonly notificationService = inject(NotificationService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  /**
   * Partner services for session data management
   * @type {SessionStoreService}
   */
  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);

  /**
   * Loading services
   * @type {LoadingService}
   */
  protected loader: LoadingService = inject(LoadingService);

  /**
   * Change detector reference
   * @type {ChangeDetectorRef}
   */
  protected changeDetectorRefs: ChangeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Jwt pipe
   * @type {BackboneJwtPipe}
   */
  protected readonly backboneJwtPipe: BackboneJwtPipe = inject(BackboneJwtPipe);

  /**
   * Jwt pipe
   * @type {DirectoryBackendJwtPipe}
   */
  protected readonly directoryBackendJwtPipe: DirectoryBackendJwtPipe = inject(DirectoryBackendJwtPipe);

  /**
   * Session data
   * @type {SessionData | undefined}
   */
  protected sessionData: SessionData | undefined;

  /**
   * Tipo de error en el login: null = sin error, 'credentials' = credenciales inválidas,
   * 'server' = error del servidor (no culpa del usuario).
   */
  protected loginErrorType: 'credentials' | 'server' | null = null;

  /**
   * Flag to indicate if the user is registering
   * @type {boolean}
   */
  isRegistering: boolean | undefined = true;

  /**
   * List of active countries
   * @type {Country[]}
   */
  protected countries: Country[] = countries.filter(country => country.active);

  /**
   * List of months
   * @type {Month[]}
   */
  protected months: Month[] = months;

  /**
   * Selected country for registration
   * @type {Country}
   */
  protected selectedCountry: Country = countries.find((country: Country): boolean => country.code === 'CA')!; // Establece Canadá como país por defecto

  /**
   * Selected month for registration
   * @type {string | null}
   */
  protected selectedMonth: string | null = null;

  /**
   * Registration data
   * @type {RegisterData}
   */
  protected registerData: RegisterData = this.authFormService.getInitialRegisterData(DEFAULT_COUNTRY_CODE);

  /**
   * Login data
   * @type {LoginData}
   */
  protected loginData: LoginData = INITIAL_LOGIN_DATA;

  /**
   * Flag to indicate if the phone number is valid
   * @type {boolean}
   */
  protected isValidPhoneNumber: boolean = true;

  /**
   * Flag to indicate if the email is valid
   * @type {boolean}
   */
  protected isEmailValid: boolean = true;

  /**
   * Flag to indicate if the full date is valid
   * @type {boolean}
   */
  protected isFullDateValid: boolean = true;

  /**
   * Flag to indicate if the full date is valid
   * @type {boolean}
   */
  protected showFullDateError: boolean = false;

  /**
   * Flag to indicate if the registration form is valid
   * @type {boolean}
   */
  protected isRegistrationFormValid: boolean = false;

  /**
   * Flag to indicate if the password is visible
   * @type {boolean}
   */
  protected showPassword: boolean = false;

  /**
   * Flag to indicate if the password is valid
   * @type {boolean}
   */
  protected isPasswordValid: boolean = true;

  /**
   * Placeholder texts for form fields in the registration form
   * @type {AuthPlaceholders}
   */
  protected placeholders: AuthPlaceholders = INITIAL_PLACEHOLDERS;

  /**
   * Dropdown signals for country and month dropdowns
   * @type {DropdownState}
   */
  protected dropdownState: DropdownState = INITIAL_DROPDOWN_STATE;

  /**
   * Router services for navigation
   * @param {Router}
   */
  private readonly router: Router = inject(Router);

  /**
   * Logger service for logging messages
   * @param {LoggerService}
   */
  private readonly logger: LoggerService = inject(LoggerService);

  /**
   * Creates an instance of Auth.

   */
  constructor() {
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   */
  ngOnInit(): void {
    this.headerService.setHeaderType(HeaderType.CENTER_HEADER);
    // Get the query parameter
    this.route.queryParams.subscribe(params => {
      this.isRegistering = params['isRegistering'] === 'true';
      this.logger.debug('Auth initialized with isRegistering:', this.isRegistering);
    });
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   */
  ngAfterViewInit(): void {
    // Removed: APP_INITIALIZER is the single source of truth for session loading
    this.changeDetectorRefs.detectChanges();
  }

  /**
   * Toggles the dropdown signals for the specified type.
   * @param type - The type of dropdown to toggle ('country' or 'month').
   */
  toggleDropdown(type: 'country' | 'month'): void {
    // Close the other dropdown if it is open and open the specified dropdown
    Object.keys(this.dropdownState).forEach((key) => {
      this.dropdownState[key as 'country' | 'month'] = key === type ? !this.dropdownState[key] : false;
    });
  }

  /**
   * Selects a country for registration.
   * @param country - The selected country.
   */
  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.registerData.country = country.code;
    this.registerData.phoneNumber = '';
    this.isValidPhoneNumber = true;
    this.dropdownState.country = false; // Cierra el menú
    this.logger.debug('Country selected:', country);
  }

  /**
   * Selects a month for registration.
   * @param month - The selected month.
   */
  selectMonth(month: Month): void {
    this.registerData.birthMonth = month.number;
    this.selectedMonth = month.abbr;
    this.dropdownState.month = false;
    this.logger.debug('Month selected:', month);
  }

  /**
   * Closes the dropdown if the click target is outside the dropdown.
   * @param target - The click target element.
   */
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    const countryButton = document.querySelector('[aria-labelledby="country-label"]');
    const monthButton = document.querySelector('[aria-labelledby="month-label"]');
    if (!countryButton?.contains(target) && !monthButton?.contains(target)) {
      this.dropdownState.country = false;
      this.dropdownState.month = false;
    }
  }

  /**
   * Toggles the registration form between login and registration modes.
   */
  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }

  /**
   * Submits the registration or login form.
   */
  onSubmit(): void {
    this.loader.show('auth');

    if (this.isRegistering) {
      this.handleRegistration();
    } else {
      this.handleLogin();
    }
  }

  /**
   * Handles user registration process.
   */
  private handleRegistration(): void {
    const userToRegister: User = new User({
      password: this.registerData.password,
      email: this.registerData.email,
      firstname: this.registerData.firstName,
      lastname: this.registerData.lastName,
      dateOfBirth: this.registerData.birthdayFull,
      phoneNumber: this.registerData.phoneNumber,
      displayName: `${this.registerData.firstName} ${this.registerData.lastName}`.trim(),
    });

    if (userToRegister.isValid()) {
      const formattedPhoneNumber = userToRegister.phoneNumber
        ? parsePhoneNumberFromString(userToRegister.phoneNumber, this.selectedCountry.code)?.formatInternational()
        : null;

      const apiPayload = {
        ...userToRegister.toApiFormat(),
        dateOfBirth: userToRegister.getFormattedDateOfBirth(),
        phoneNumber: formattedPhoneNumber ?? userToRegister.phoneNumber,
      };

      this.userClient.createUser(apiPayload).pipe(takeUntil(this.subject$)).subscribe({
        next: (response: any) => {
          this.logger.debug('User created:', response);
          this.handleLogin();
        },
        error: (error: any) => {
          this.logger.error('Error creating user:', error);
          this.notificationService.error('Error creating user. Please try again.');
          this.loader.hide('auth');
        },
      });
    } else {
      this.logger.error('Invalid user data:', userToRegister);
      this.notificationService.error('Invalid registration data. Please check your inputs.');
      this.loader.hide('auth');
    }
  }

  /**
   * Handles user login process.
   */
  private handleLogin(): void {
    const email = this.isRegistering ? this.registerData.email : this.loginData.email;
    const password = this.isRegistering ? this.registerData.password : this.loginData.password;

    this.logger.debug('Login Data:', {email});
    this.authenticateUser(email, password);
  }

  /**
   * Toggles the visibility of the password field.
   * @param field - The field to toggle.
   * @param passwordField - The password input element.
   */
  togglePasswordVisibility(_field: string, passwordField: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  /**
   * Handles social login button clicks.
   * @param provider - The social provider selected.
   */
  handleSocialLogin(provider: SocialProvider): void {
    this.logger.debug(`Social login with ${provider} initiated`);
    // TODO: Implement social login logic
    this.notificationService.info(`Social login with ${provider} coming soon!`);
  }

  onForgotPassword(): void {
    this.logger.debug('Forgot password clicked');
    this.notificationService.info('Forgot password functionality is not implemented yet.');
  }

  /**
   * Sets the placeholder text for the specified field when it gains focus.
   * @param field - The field that gained focus.
   */
  onFocus(field: string): void {
    this.placeholders[field] = this.placeholderService.getFocusPlaceholder(field, this.selectedCountry);
  }

  /**
   * Resets the placeholder text for the specified field when it loses focus.
   * @param field - The field that lost focus.
   */
  onBlur(field: string): void {
    this.placeholders[field] = this.placeholderService.getBlurPlaceholder(field);
  }

  /**
   * Validates the email address.
   */
  validateEmail(): void {
    this.isEmailValid = this.authValidationService.validateEmail(this.registerData.email);
  }

  /**
   * Validates the password.
   */
  validatePassword(): void {
    this.isPasswordValid = this.authValidationService.validatePassword(this.registerData.password);
  }

  /**
   * Validates the phone number.
   */
  validatePhoneNumber(): void {
    this.isValidPhoneNumber = this.authValidationService.validatePhoneNumber(
      this.registerData.phoneNumber,
      this.selectedCountry
    );
  }

  /**
   * Validates the registration form.
   */
  validateRegistrationForm(): void {
    const userToValidate: User = new User({
      password: this.registerData.password,
      email: this.registerData.email,
      firstname: this.registerData.firstName,
      lastname: this.registerData.lastName,
      dateOfBirth: this.registerData.birthdayFull,
      phoneNumber: this.registerData.phoneNumber,
      displayName: `${this.registerData.firstName} ${this.registerData.lastName}`.trim(),
    });

    this.validateDateOfBirth(userToValidate);

    // Use validation services for each field
    this.validateEmail();
    this.validatePassword();
    this.validatePhoneNumber();

    this.isRegistrationFormValid = userToValidate.isValid() &&
      this.isFullDateValid &&
      this.isEmailValid &&
      this.isPasswordValid &&
      this.isValidPhoneNumber;

    this.logger.debug('Is Registration Form Valid:', this.isRegistrationFormValid);
  }

  /**
   * Validates the date of birth.
   * @param user - The user to validate.
   */
  private validateDateOfBirth(_user: User): void {
    const {birthDay: day, birthMonth: month, birthYear: year} = this.registerData;

    if (day && month && year) {
      const validationResult = this.authValidationService.validateDateOfBirth(day, month, year);

      if (validationResult) {
        this.registerData.birthdayFull = validationResult;
        this.isFullDateValid = true;
        this.showFullDateError = false;
      } else {
        this.logger.error("Invalid date of birth.");
        this.isFullDateValid = false;
        this.showFullDateError = true;
        this.registerData.birthdayFull = null;
      }
    } else {
      this.logger.error("Date of birth fields are incomplete.");
      this.isFullDateValid = false;
      this.registerData.birthdayFull = null;
    }
  }

  /**
   * Authenticates the user.
   * @param email - The user's email.
   * @param password - The user's password.
   */
  private authenticateUser(email: string, password: string): void {
    this.loader.show('auth'); // Usando una key específica para auth
    let tokenObtained = false;
    this.authClient.getToken(email, password).pipe(takeUntil(this.subject$), concatMap((response: any) => {
        this.logger.debug('Authentication response:', response);
        tokenObtained = true; // getToken exitoso — cualquier error a partir de aquí es del servidor

        const decodedTokenBackbone = this.backboneJwtPipe.transform(response.sessionTokenBkd);
        let resull: any;
        this.saveSession({userDetail: null, userDetailResponse: response});

        if (decodedTokenBackbone?.uid) {
          resull = this.userClient.findUserById(decodedTokenBackbone.uid)
            .pipe(map((userDetail: any) => userDetail || null),
              concatMap((userDetail: any): Observable<{ userDetail: any, userDetailResponse: any }> => {
                return of({userDetail, userDetailResponse: response});
              })
            );
        }
        return resull;
      })
    ).subscribe({
      next: (resultSet: any) => {
        const userAuth = this.saveSession(resultSet);
          this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
          this.clearForm();
          this.router.navigate([userAuth.verifiedComplete ? DFC.RelativePath.STAGE_PATH : '/veracode']);
          this.loader.hide('auth');
      },
      error: (error: any) => {
        this.sessionStoreService.clearSessionData();
        // Si getToken no completó, el error es de credenciales (sin importar el status code).
        // Si getToken ya completó, el error viene de findUserById — culpa del servidor.
        this.loginErrorType = tokenObtained ? 'server' : 'credentials';
        this.logger.error('Error authenticating user:', error);
        this.loader.hide('auth');
      }
    });

    // .subscribe({
    //   next: (response: any) => {
    //     const decodedTokenBackbone = this.backboneJwtPipe.transform(response.sessionTokenBkd);
    //     const decodedTokenDirectory = this.directoryBackendJwtPipe.transform(response.body.token);
    //     if (decodedTokenBackbone && decodedTokenDirectory) {
    //       userAuth = {
    //         alias: decodedTokenBackbone.alias??'',
    //         email: decodedTokenBackbone.email??'',
    //         fullName: `${decodedTokenBackbone.firstname} ${decodedTokenBackbone.lastname}`.trim(),
    //         sessionTokenBkd: response.sessionTokenBkd,
    //         sessionToken: response.body.token,
    //         authorization: response.authorization,
    //         features: []
    //       };
    //       if (decodedTokenBackbone?.uid) {
    //         this.sessionData = {userAuth, token: decodedTokenBackbone?.uid};
    //         this.sessionStoreService.saveSessionData(this.sessionData);
    //
    //         // Verificar que el estado se guardó correctamente
    //         this.sessionStoreService.session$.subscribe(sessionData => {
    //           console.debug(`Current session in store after save: ${JSON.stringify(sessionData)}`);
    //         });
    //         this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
    //         this.clearForm();
    //
    //         if(decodedTokenDirectory.vcCompleted === 'true') {
    //           this.router.navigate([DFC.RelativePath.STAGE_PATH]);
    //         } else {
    //           this.router.navigate(['/veracode']);
    //         }
    //       }
    //     }
    //     this.loader.hide('auth');
    //   },
    //   error: (error: any) => {
    //     this.isErrorFound = true;
    //     if (error.status === DFC.HttpStatus.HTTP_STATUS_UNAUTHORIZED.code ||
    //         error.status === DFC.HttpStatus.HTTP_STATUS_CONFLICT.code) {
    //       this.notificationService.error('Invalid credentials. Please check your email and password.');
    //     } else {
    //       this.notificationService.error('Login failed. Please try again later.');
    //     }
    //     console.error('Error authenticating user:', error);
    //     this.loader.hide('auth');
    //   },
    // });
  }

  /**
   * Clears all fields in the registration form.
   */
  clearForm(): void {
    this.registerData = this.authFormService.getInitialRegisterData(this.selectedCountry.code);
    this.resetValidationFlags();
    this.selectedMonth = null;
    this.loginData = INITIAL_LOGIN_DATA;
    this.logger.debug('Form cleared');

  }

  /**
   * Resets all validation flags to their initial state.
   */
  private resetValidationFlags(): void {
    this.isValidPhoneNumber = true;
    this.isEmailValid = true;
    this.isFullDateValid = true;
    this.showFullDateError = false;
    this.isRegistrationFormValid = false;
    this.isPasswordValid = true;
  }

  private saveSession(data: { userDetail: any, userDetailResponse: any }): UserAuth {
    const avatar = data?.userDetail?.data?.profileImageRef ? data.userDetail.data.profileImageRef : '';
    const decodedTokenBackbone = this.backboneJwtPipe.transform(data.userDetailResponse.sessionTokenBkd);
    const decodedTokenDirectory = this.directoryBackendJwtPipe.transform(data.userDetailResponse.body.token);
    if (!decodedTokenBackbone || !decodedTokenBackbone?.uid || !decodedTokenDirectory) {
      throw new Error('Invalid token format');
    }
    const userAuth = {
      alias: decodedTokenBackbone.alias ?? '',
      email: decodedTokenBackbone.email ?? '',
      fullName: `${decodedTokenBackbone.firstname} ${decodedTokenBackbone.lastname}`.trim(),
      sessionTokenBkd: data.userDetailResponse.sessionTokenBkd,
      sessionToken: data.userDetailResponse.body.token,
      authorization: data.userDetailResponse.authorization,
      features: [],
      businesses: data?.userDetail?.data?.businessIds || [],
      verifiedComplete: decodedTokenDirectory.vcCompleted === 'true',
      avatarUrl: avatar,
      initials: getInitials(decodedTokenBackbone.firstname ?? '', decodedTokenBackbone.lastname ?? '')
    };
    this.sessionData = {userAuth, token: decodedTokenBackbone?.uid};
    this.sessionStoreService.saveSessionData(this.sessionData);

    this.sessionStoreService.session$.subscribe(sessionData => {
      this.logger.debug(`Current session in store after save: ${JSON.stringify(sessionData)}`);
    });

    return userAuth;
  }
}
