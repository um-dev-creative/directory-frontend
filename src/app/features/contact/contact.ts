import { Component, HostListener, inject } from '@angular/core';
import { Country, countries } from 'assets/data/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {parsePhoneNumberFromString, getExampleNumber, PhoneNumber, Examples} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { LoggerService } from '@app/core/services/logger.service';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  private readonly logger = inject(LoggerService);

  countries: Country[] = countries.filter(country => country.active);
  placeholders: { [key: string]: string } = {
    email: '',
    phone: '',
  };
  dropdownState = {
    country: false,
  };
  selectedCountry: Country = countries.find((country) => country.code === 'CA')!;
  protected isValidPhoneNumber: boolean = true;
  protected isContactFormValid: boolean = false;
  protected isEmailValid: boolean = true;

  // Valores del formulario de contacto
  contactData = {
    firstName: '',
    lastName: '',
    email: '',
    country: this.selectedCountry.code,
    phoneNumber: '',
    subject: '',
    message: '',
  };

  onSubmit() {
    this.logger.info('Form submitted!', this.contactData);
  }
  onFocus(field: string): void {
    if (field === 'email') {
      this.placeholders[field] = 'example@domain.com';
    } else if (field === 'phone') {
      const focusPhoneNumber: PhoneNumber | undefined = getExampleNumber(this.selectedCountry.code, examples as Examples);
      this.placeholders[field] = focusPhoneNumber ? focusPhoneNumber.formatNational() : this.selectedCountry.nationalTemplate;
    }
  }
  onBlur(field: string): void {
    // Restaurar el placeholder original
    if (field === 'email') {
      this.placeholders[field] = '';
    } else if (field === 'phone') {
      this.placeholders[field] = '';
    }
  }
  toggleDropdown(type: 'country' ): void {
    Object.keys(this.dropdownState).forEach((key) => {
      this.dropdownState[key as 'country' ] = key === type ? !this.dropdownState[key] : false;
    });
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    const countryButton = document.querySelector('[aria-labelledby="country-label"]');
    if (!countryButton?.contains(target)) {
      this.dropdownState.country = false;
    }
  }
  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.contactData.phoneNumber = '';
    this.isValidPhoneNumber = true;
    this.dropdownState.country = false; // Cierra el menú
    this.logger.debug('Country selected:', country);
  }
  validateEmail() {
    const email = this.contactData.email;
    if (!email) {
      this.isEmailValid = true;
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(email);
  }
  validatePhoneNumber(): void {
    const selectedCountry: Country = this.selectedCountry;
    const phoneNumber: string = this.contactData.phoneNumber;
    if (!phoneNumber) {
      this.isValidPhoneNumber = true;
      return;
    }
    this.isValidPhoneNumber = selectedCountry
      ? parsePhoneNumberFromString(phoneNumber, selectedCountry.code)?.isValid() ?? false
      : false;
  }

  validateContactForm() {
    // Validar individualmente cada campo y almacenar el resultado
    const isEmailValid = this.isEmailValid;
    const isPhoneValid = this.isValidPhoneNumber;
    const hasFirstName = !!this.contactData.firstName;
    const hasLastName = !!this.contactData.lastName;
    const hasSubject = !!this.contactData.subject;
    const hasMessage = !!this.contactData.message;

    // Depurar campos que fallan
    if (!isEmailValid) this.logger.warn("Invalid email address.");
    if (!isPhoneValid) this.logger.warn("Invalid phone number.");
    if (!hasFirstName) this.logger.warn("First name is missing.");
    if (!hasLastName) this.logger.warn("Last name is missing.");
    if (!hasSubject) this.logger.warn("Subject is missing.");
    if (!hasMessage) this.logger.warn("Message is missing.");

    // Determinar la validez total del formulario
    this.isContactFormValid = isEmailValid && isPhoneValid && hasFirstName && hasLastName && hasSubject && hasMessage;

    // Opcional: registrar el estado final
    this.logger.info(`Contact form valid: ${this.isContactFormValid}`);
  }

}
