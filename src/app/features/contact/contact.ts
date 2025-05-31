import { Component, HostListener } from '@angular/core';
import { Country, countries } from '@shared/data/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {parsePhoneNumberFromString, getExampleNumber, PhoneNumber, Examples} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';

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
    console.log('Form submitted!', this.contactData);
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
  @HostListener('document:click', ['$event.target'])
  closeDropdown(target: HTMLElement): void {
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
    console.log('Country selected:', country);
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
    if (!isEmailValid) console.error("Invalid email address.");
    if (!isPhoneValid) console.error("Invalid phone number.");
    if (!hasFirstName) console.error("First name is missing.");
    if (!hasLastName) console.error("Last name is missing.");
    if (!hasSubject) console.error("Subject is missing.");
    if (!hasMessage) console.error("Message is missing.");

    // Determinar la validez total del formulario
    this.isContactFormValid = isEmailValid && isPhoneValid && hasFirstName && hasLastName && hasSubject && hasMessage;

    // Opcional: registrar el estado final
    console.log(`Contact form valid: ${this.isContactFormValid}`);
  }

}
