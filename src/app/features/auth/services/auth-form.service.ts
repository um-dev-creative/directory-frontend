import { Injectable } from '@angular/core';
import { Country } from 'assets/data/common';
import { RegisterData } from '../models/register-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthFormService {

  getInitialRegisterData(countryCode: string): RegisterData {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      country: countryCode,
      phoneNumber: '',
      birthMonth: null,
      birthDay: null,
      birthYear: null,
      birthdayFull: null,
    };
  }

  clearForm(selectedCountry: Country): RegisterData {
    return this.getInitialRegisterData(selectedCountry.code);
  }

  getPlaceholders(): { [key: string]: string } {
    return {
      day: 'Dia',
      year: 'Año',
      email: 'Email Address',
      mobile: 'Mobile Number (optional)',
    };
  }
}
