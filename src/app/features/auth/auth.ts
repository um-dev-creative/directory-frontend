import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {countries, Country, Month, months} from '@shared/data/common';
import {Examples, getExampleNumber, parsePhoneNumberFromString, PhoneNumber} from 'libphonenumber-js';
import {UserClient} from '@app/user/user.client';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {User} from '@shared/models/register-user.model';
import {App} from '@app/app';
import {AlertService} from '@shared/services/alert.service';
import {AuthClient} from '@app/features/auth/auth.client';
import {LoadingService} from '@shared/services/loading.service';
import {SessionData, UserAuth} from '@shared/signals/session/session.state';
import {JwtPipe} from '@shared/services/jwt.pipe';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {loadSession} from '@shared/signals/session/session.action';
import {DFC} from '@shared/app.const';
import {INITIAL_LOGIN_DATA, LoginData} from '@shared/models/login-data.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {HeaderService} from '@app/header/header.service';
import {SessionStoreService} from '@shared/signals/session/session-store.service';
import examples from 'libphonenumber-js/examples.mobile.json';
import {HeaderType} from '@shared/constants/header-type';

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
   * @type {{firstName: string, lastName: string, email: string,
   * password: string, country: string, phoneNumber: string,
   * birthMonth: number | null, birthDay: number | null,
   * birthYear: number | null, birthdayFull: Date | null}}
   */
  protected registerData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    phoneNumber: string;
    birthMonth: number | null;
    birthDay: number | null;
    birthYear: number | null;
    birthdayFull: Date | null;
  } = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: this.selectedCountry.code,
    phoneNumber: '',
    birthMonth: null as number | null,
    birthDay: null as number | null,
    birthYear: null as number | null,
    birthdayFull: null as Date | null,
  };

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
   * @type {{day: string, year: string, email: string, mobile: string}}
   */
  protected placeholders: { [key: string]: string } = {
    day: 'Dia',
    year: 'Año',
    email: 'Email Address',
    mobile: 'Mobile Number (optional)',
  };

  /**
   * Dropdown signals for country and month dropdowns
   * @type {{country: boolean, month: boolean}}
   */
  protected dropdownState: { country: boolean; month: boolean; } = {
    country: false,
    month: false,
  };

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
  onSubmit() {
    this.loader.show();
    if (this.isRegistering) {
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
            this.authenticateUser(this.loginData.email, this.loginData.password);
          },
          error: (error: any) => {
            console.error('Error creating user:', error);
          },
        });
      } else {
        console.error('Invalid user data:', userToRegister);
      }
    } else {
      console.debug('Login Data:', this.loginData);
      this.authenticateUser(this.loginData.email, this.loginData.password);
    }
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
    if (field === 'day') {
      this.placeholders[field] = 'dd';
    } else if (field === 'year') {
      this.placeholders[field] = 'yyyy';
    } else if (field === 'email') {
      this.placeholders[field] = 'example@domain.com';
    } else if (field === 'mobile') {
      const focusPhoneNumber: PhoneNumber | undefined = getExampleNumber(this.selectedCountry.code, examples as Examples);
      this.placeholders[field] = focusPhoneNumber ? focusPhoneNumber.formatNational() : this.selectedCountry.nationalTemplate;
    }
  }

  /**
   * Resets the placeholder text for the specified field when it loses focus.
   * @param field - The field that lost focus.
   */
  onBlur(field: string): void {
    if (field === 'day') {
      this.placeholders[field] = 'Dia';
    } else if (field === 'year') {
      this.placeholders[field] = 'Año';
    } else if (field === 'email') {
      this.placeholders[field] = 'Email Address';
    } else if (field === 'mobile') {
      this.placeholders[field] = 'Mobile Number (optional)';
    }
  }

  /**
   * Validates the email address.
   */
  validateEmail() {
    const email = this.registerData.email;
    if (!email) {
      this.isEmailValid = true;
      return;
    }
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(email);
  }

  /**
   * Validates the password.
   */
  validatePassword(): void {
    const password: string = this.registerData.password;
    if (!password || password.length >= 8) {
      this.isPasswordValid = true;
      return;
    }
    const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //
    this.isPasswordValid = passwordRegex.test(password);
  }

  /**
   * Validates the phone number.
   */
  validatePhoneNumber(): void {
    const selectedCountry: Country = this.selectedCountry;
    const phoneNumber: string = this.registerData.phoneNumber;
    if (!phoneNumber) {
      this.isValidPhoneNumber = true;
      return;
    }
    this.isValidPhoneNumber = selectedCountry
      ? parsePhoneNumberFromString(phoneNumber, selectedCountry.code)?.isValid() ?? false
      : false;
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

    this.isRegistrationFormValid = userToValidate.isValid() && this.isFullDateValid && this.isEmailValid && this.isPasswordValid && this.isValidPhoneNumber;

    console.debug('Is Registration Form Valid:', this.isRegistrationFormValid);
  }

  /**
   * Validates the date of birth.
   * @param user - The user to validate.
   */
  private validateDateOfBirth(user: User): void {
    const {birthDay: day, birthMonth: month, birthYear: year} = this.registerData;
    if (day && month && year) {
      const validDate: Date | false = user.isValidDate(day, month, year);
      if (validDate) {
        this.registerData.birthdayFull = validDate;
        this.isFullDateValid = true;
        this.showFullDateError = false
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
    let userAuth = new UserAuth();
    this.authClient.getToken(email, password).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          console.log('User authenticated:', response);
          const decodedToken = this.jwtPipe.transform(response.sessionTokenBkd);
          if (decodedToken) {
            userAuth = {
              alias: decodedToken.alias?decodedToken.alias:'',
              email: decodedToken.email?decodedToken.email:'',
              fullName: `${decodedToken.firstname} ${decodedToken.lastname}`.trim(),
              sessionTokenBkd: response.sessionTokenBkd,
              sessionToken: response.body.token,
              features: []
            };
            if (decodedToken?.uid) {
              this.sessionData = {userAuth, token: decodedToken?.uid};
              this.sessionStoreService.saveSessionData(this.sessionData)
              console.debug(`Saved sessionData :: ${JSON.stringify(this.sessionData)}`);
              this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
              // this.router.navigate([DFC.RelativePath.STAGE_UI_PATH]);
              this.clearForm();
              this.router.navigate(['/veracode']);
            }
          }
          this.loader.hide();
        },
        error: (error: any) => {
          this.isErrorFound = true;
          if (error.status === DFC.HttpStatus.HTTP_STATUS_CONFLICT) {
            this.alertService.error('Invalid credentials', true);
          }
          console.error('Error authenticating user:', error);
          this.loader.hide();
        },
      });
  }

  /**
   * Clears all fields in the registration form.
   */
  clearForm(): void {
    this.registerData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      country: this.selectedCountry.code,
      phoneNumber: '',
      birthMonth: null,
      birthDay: null,
      birthYear: null,
      birthdayFull: null,
    };

    this.isValidPhoneNumber = true;
    this.isEmailValid = true;
    this.isFullDateValid = true;
    this.showFullDateError = false;
    this.isRegistrationFormValid = false;
    this.isPasswordValid = true;
    this.selectedMonth = null;
    this.loginData.email = '';
    this.loginData.password = '';
    console.debug('Form cleared');
  }

}
