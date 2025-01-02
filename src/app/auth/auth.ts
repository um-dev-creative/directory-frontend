import { Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '@app/header/header';
import { Country, countries, Month, months } from '@shared/commonData';
import { isValidDate } from '@shared/utils';

@Component({
  selector: 'app-auth',
  imports: [
    Header,
    CommonModule,
    FormsModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  isRegistering: boolean = true;
  countries: Country[] = countries.filter(country => country.active);
  months: Month[] = months;
  selectedCountry: Country = countries.find((country) => country.code === 'CA')!; // Establece Canadá como país por defecto
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
    birthday: null as Date | null,
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
      console.log('Register Data:', this.registerData);
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
      this.placeholders[field] = '123-456-7890';
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(email);
  }
  validatePassword() {
    const password: string = this.registerData.password;
    if (!password || password.length >= 8) {
      this.isPasswordValid = true;
      return;
    }
    const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //
    this.isPasswordValid = passwordRegex.test(password);
  }
  validatePhoneNumber(): void {
    const selectedCountry = this.selectedCountry;
    const phoneNumber = this.registerData.phoneNumber;
    if (!phoneNumber) {
      this.isValidPhoneNumber = true;
      return;
    }
    this.isValidPhoneNumber = selectedCountry
      ? selectedCountry.regex.test(phoneNumber)
      : false;
  }

  validateRegistrationForm(): void {
    // Log inicial para depuración
    console.log("Validating Registration Form...");
    console.log({
      FirstName: this.registerData.firstName,
      LastName: this.registerData.lastName,
      Email: this.registerData.email,
      Password: this.registerData.password,
      Birthday: this.registerData.birthday,
      BirthMonth: this.registerData.birthMonth,
      BirthDay: this.registerData.birthDay,
      BirthYear: this.registerData.birthYear,
      IsPhoneNumberValid: this.isValidPhoneNumber,
    });

    // Validar la fecha de nacimiento
    if (
      this.registerData.birthDay &&
      this.registerData.birthMonth &&
      this.registerData.birthYear
    ) {
      const validDate = isValidDate(
        this.registerData.birthDay,
        this.registerData.birthMonth,
        this.registerData.birthYear
      );

      if (validDate) {
        this.registerData.birthday = validDate;
        this.isFullDateValid = true;
      } else {
        console.error("Invalid date of birth.");
        this.isFullDateValid = false;
        this.registerData.birthday = null; // Limpia el valor si no es válido
      }
    }

    // Validar campos requeridos y actualizar el estado de validación del formulario
    this.isRegistrationFormValid =
      !!this.registerData.firstName &&
      !!this.registerData.lastName &&
      !!this.registerData.email &&
      !!this.registerData.password &&
      !!this.registerData.birthday &&
      this.isValidPhoneNumber;

    // Log final para depuración
    console.log("Is Registration Form Valid:", this.isRegistrationFormValid);
  }
}

