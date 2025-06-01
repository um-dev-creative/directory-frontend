// Angular Core
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { AlertService } from '@app/core/services101/alert.service';
import { LoadingService } from '@app/core/services101/loading.service';
import { AuthService } from '@app/core/services';
// App Store
import { loadSession } from '@app/core/store/session/session.action';
import { SessionData, UserAuth } from '@app/core/store/session/session.state';
import { SessionStoreService } from '@app/core/store/session/session-store.service';
// App Components & Services
import { App } from '@app/app';
import { AuthClient } from './auth.client';
import { HeaderService } from '@app/header/header.service';
import { UserClient } from '@app/user/user.client';
// Shared
import { JwtPipe } from '@app/shared/pipes/jwt.pipe';
import { DFC } from '@app/shared/constants/app.const';
import { HeaderType } from '@shared/constants/header-type';
import { INITIAL_LOGIN_DATA, LoginData } from '@shared/models/login-data.model';
import { User } from '@shared/models/register-user.model';
// Assets
import { countries, Country, Month, months } from 'assets/data/common';
// Auth Services
import { AuthValidationService } from './services/auth-validation.service';
import { AuthFormService } from './services/auth-form.service';
import { PlaceholderService } from './services/placeholder.service';
// Auth Models
import { RegisterData } from './models/register-data.interface';
import { DropdownState } from './models/dropdown-state.interface';
import { AuthPlaceholders } from './models/auth-placeholders.interface';
// Auth Constants
import { INITIAL_PLACEHOLDERS, INITIAL_DROPDOWN_STATE, DEFAULT_COUNTRY_CODE } from './auth.constants';

/**
 * Component for handling user authentication.
 */
@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinner
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  providers: [JwtPipe]
})
export class Auth implements OnDestroy, OnInit, AfterViewInit {
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
   * Core authentication service
   * @type {AuthService}
   */
  private readonly authService: AuthService = inject(AuthService);

  /**
   * User client services
   * @type {AuthClient}
   */
  private readonly authClient: AuthClient = inject(AuthClient);

  /**
   * Partner services for session data management
   * @type {Store<{ session: SessionData }>}
   */
  private readonly store: Store<{ session: SessionData }> = inject(Store);

  /**
   * Header services for changing the header type
   * @type {HeaderService}
   */
  private readonly headerService: HeaderService = inject(HeaderService);

  /**
   * Alert services
   * @type {AlertService}
   */
  private readonly alertService: AlertService = inject(AlertService);

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
   * @type {JwtPipe}
   */
  protected readonly jwtPipe: JwtPipe = inject(JwtPipe);

  /**
   * Session data
   * @type {SessionData | undefined}
   */
  protected sessionData: SessionData | undefined;

  /**
   * Flag to indicate if an error was found
   * @type {boolean}
   */
  protected isErrorFound: boolean = false;

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
   * Creates an instance of Auth.
   * @param appComponent - App component services
   */
  constructor(private readonly appComponent: App) {
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
      console.debug('Auth initialized with isRegistering:', this.isRegistering);
    });
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   */
  ngAfterViewInit(): void {
    this.store.dispatch(loadSession());
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
    console.debug ('Country selected:', country);
  }

  /**
   * Selects a month for registration.
   * @param month - The selected month.
   */
  selectMonth(month: Month): void {
    this.registerData.birthMonth = month.number;
    this.selectedMonth = month.abbr;
    this.dropdownState.month = false;
    console.debug('Month selected:', month);
  }

  /**
   * Closes the dropdown if the click target is outside the dropdown.
   * @param target - The click target element.
   */
  @HostListener('document:click', ['$event.target'])
  closeDropdown(target: HTMLElement): void {
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
    this.loader.show();

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
          console.debug('User created:', response);
          this.handleLogin();
        },
        error: (error: any) => {
          console.error('Error creating user:', error);
          this.loader.hide();
        },
      });
    } else {
      console.error('Invalid user data:', userToRegister);
      this.loader.hide();
    }
  }

  /**
   * Handles user login process.
   */
  private handleLogin(): void {
    const email = this.isRegistering ? this.registerData.email : this.loginData.email;
    const password = this.isRegistering ? this.registerData.password : this.loginData.password;

    console.debug('Login Data:', { email, password: '***' });
    this.authenticateUser(email, password);
  }

  /**
   * Toggles the visibility of the password field.
   * @param field - The field to toggle.
   * @param passwordField - The password input element.
   */
  togglePasswordVisibility(field: string, passwordField: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    passwordField.type = this.showPassword ? 'text' : 'password';
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

    console.debug('Is Registration Form Valid:', this.isRegistrationFormValid);
  }

  /**
   * Validates the date of birth.
   * @param user - The user to validate.
   */
  private validateDateOfBirth(user: User): void {
    const { birthDay: day, birthMonth: month, birthYear: year } = this.registerData;

    if (day && month && year) {
      const validationResult = this.authValidationService.validateDateOfBirth(day, month, year);

      if (validationResult) {
        this.registerData.birthdayFull = validationResult;
        this.isFullDateValid = true;
        this.showFullDateError = false;
      } else {
        console.error("Invalid date of birth.");
        this.isFullDateValid = false;
        this.showFullDateError = true;
        this.registerData.birthdayFull = null;
      }
    } else {
      console.error("Date of birth fields are incomplete.");
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
    const credentials = { email, password };
    this.authService.login(credentials).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (success: boolean) => {
          if (success) {
            console.log('User authenticated successfully');

            // Get the current user from the auth service
            const currentUser = this.authService.getCurrentUser();

            if (currentUser) {
              // Create UserAuth object for your session store
              const userAuth: UserAuth = {
                alias: currentUser.email,
                email: currentUser.email,
                fullName: currentUser.name,
                sessionTokenBkd: this.authService.getToken() || '',
                sessionToken: this.authService.getToken() || '',
                features: currentUser.permissions || []
              };

              // Save session data
              this.sessionData = { userAuth, token: currentUser.id };
              this.sessionStoreService.saveSessionData(this.sessionData);
              console.debug(`Saved sessionData :: ${JSON.stringify(this.sessionData)}`);

              // Update header and navigate
              this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
              this.clearForm();
              this.router.navigate(['/veracode']);
            }
          } else {
            // Login failed
            this.isErrorFound = true;
            this.alertService.error('Invalid credentials', true);
            console.error('Login failed: Invalid credentials');
          }
          this.loader.hide();
        },
        error: (error: any) => {
          this.isErrorFound = true;
          this.alertService.error('Login failed. Please try again.', true);
          console.error('Error authenticating user:', error);
          this.loader.hide();
        }
      });

    // this.authClient.getToken(email, password).pipe(takeUntil(this.subject$))
    //   .subscribe({
    //     next: (response: any) => {
    //       console.log('User authenticated:', response);
    //       const decodedToken = this.jwtPipe.transform(response.sessionTokenBkd);
    //       if (decodedToken) {
    //         userAuth = {
    //           alias: decodedToken.alias?decodedToken.alias:'',
    //           email: decodedToken.email?decodedToken.email:'',
    //           fullName: `${decodedToken.firstname} ${decodedToken.lastname}`.trim(),
    //           sessionTokenBkd: response.sessionTokenBkd,
    //           sessionToken: response.body.token,
    //           features: []
    //         };
    //         if (decodedToken?.uid) {
    //           this.sessionData = {userAuth, token: decodedToken?.uid};
    //           this.sessionStoreService.saveSessionData(this.sessionData)
    //           console.debug(`Saved sessionData :: ${JSON.stringify(this.sessionData)}`);
    //           this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
    //           // this.router.navigate([DFC.RelativePath.STAGE_UI_PATH]);
    //           this.clearForm();
    //           this.router.navigate(['/veracode']);
    //         }
    //       }
    //       this.loader.hide();
    //     },
    //     error: (error: any) => {
    //       this.isErrorFound = true;
    //       if (error.status === DFC.HttpStatus.HTTP_STATUS_CONFLICT) {
    //         this.alertService.error('Invalid credentials', true);
    //       }
    //       console.error('Error authenticating user:', error);
    //       this.loader.hide();
    //     },
    //   });
  }

  /**
   * Clears all fields in the registration form.
   */
  clearForm(): void {
    this.registerData = this.authFormService.getInitialRegisterData(this.selectedCountry.code);
    this.resetValidationFlags();
    this.selectedMonth = null;
    this.loginData = INITIAL_LOGIN_DATA;
    console.debug('Form cleared');
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

}
