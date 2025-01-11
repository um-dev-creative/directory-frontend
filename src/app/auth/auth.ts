import {Component, HostListener, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Country, countries, Month, months } from '@shared/data/common';
import { parsePhoneNumberFromString, getExampleNumber, PhoneNumber, Examples } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { UserClient } from '@app/user/user.client';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '@shared/models/register-user.model';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  private readonly userClient: UserClient = inject(UserClient);
  private subject$ = new Subject<void>();

  isRegistering: boolean = true;
  countries: Country[] = countries.filter(country => country.active);
  months: Month[] = months;
  selectedCountry: Country = countries.find((country: Country):boolean => country.code === 'CA')!; // Establece Canadá como país por defecto
  selectedMonth: string | null = null;
  // Valores del formulario de registro
  registerData = {
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
  // Valores del formulario de inicio de sesión
  loginData: { email:string, password:string } = {
    email: '',
    password: '',
  };
  // Estados de validación
  protected isValidPhoneNumber: boolean = true;
  protected isEmailValid: boolean = true;
  protected isFullDateValid: boolean = true;
  protected showFullDateError: boolean = false;
  protected isRegistrationFormValid: boolean = false;
  protected showPassword: boolean = false;
  protected isPasswordValid: boolean = true;
  // Placeholders dinámicos
  placeholders: { [key: string]: string } = {
    day: 'Dia',
    year: 'Año',
    email: 'Email Address',
    mobile: 'Mobile Number (optional)',
  };

  dropdownState = {
    country: false,
    month: false,
  };
  toggleDropdown(type: 'country' | 'month'): void {
    // Cierra otros dropdowns antes de abrir el seleccionado
    Object.keys(this.dropdownState).forEach((key) => {
      this.dropdownState[key as 'country' | 'month'] = key === type ? !this.dropdownState[key] : false;
    });
  }
  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.registerData.country = country.code;
    this.registerData.phoneNumber = '';
    this.isValidPhoneNumber = true;
    this.dropdownState.country = false; // Cierra el menú
    console.log('Country selected:', country);
  }
  selectMonth(month: Month): void {
    this.registerData.birthMonth = month.number;
    this.selectedMonth = month.abbr;
    this.dropdownState.month = false;
    console.log('Month selected:', month);
  }
  // Cierra el dropdown al hacer clic fuera del componente

  @HostListener('document:click', ['$event.target'])
  closeDropdown(target: HTMLElement): void {
    const countryButton = document.querySelector('[aria-labelledby="country-label"]');
    const monthButton = document.querySelector('[aria-labelledby="month-label"]');
    if (!countryButton?.contains(target) && !monthButton?.contains(target)) {
      this.dropdownState.country = false;
      this.dropdownState.month = false;
    }
  }
  toggleForm(event: Event) {
    event.preventDefault();
    this.isRegistering = !this.isRegistering;
  }
  onSubmit() {
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
          phoneNumber: formattedPhoneNumber || userToRegister.phoneNumber,
        };
        this.userClient.createUser(apiPayload).pipe(takeUntil(this.subject$)).subscribe({
          next: (response: any) => {
            console.log('User created:', response);
          },
          error: (error: any) => {
            console.error('Error creating user:', error);
          },
        });
      } else {
        console.error('Invalid user data:', userToRegister);
      }
    } else {
      console.log('Login Data:', this.loginData);
    }
  }
  togglePasswordVisibility(field: string, passwordField: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }
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
  onBlur(field: string): void {
    // Restaurar el placeholder original
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
  validateEmail() {
    const email = this.registerData.email;
    if (!email) {
      this.isEmailValid = true;
      return;
    }
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(email);
  }
  validatePassword(): void {
    const password: string = this.registerData.password;
    if (!password || password.length >= 8) {
      this.isPasswordValid = true;
      return;
    }
    const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //
    this.isPasswordValid = passwordRegex.test(password);
  }
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

  private validateDateOfBirth(user: User): void {
    const { birthDay: day, birthMonth: month, birthYear: year } = this.registerData;
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

    console.log('Is Registration Form Valid:', this.isRegistrationFormValid);
  }
}
