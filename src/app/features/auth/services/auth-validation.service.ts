import { Injectable } from '@angular/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Country } from 'assets/data/common';
import { User } from '@shared/models/register-user.model';
import { VALIDATION_PATTERNS } from '../auth.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthValidationService {

  validateEmail(email: string): boolean {
    if (!email) return true;
    const emailRegex = VALIDATION_PATTERNS.EMAIL;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    if (!password || password.length >= 8) return true;
    const passwordRegex = VALIDATION_PATTERNS.PASSWORD;
    return passwordRegex.test(password);
  }

  validatePhoneNumber(phoneNumber: string, country: Country): boolean {
    if (!phoneNumber) return true;
    return parsePhoneNumberFromString(phoneNumber, country.code)?.isValid() ?? false;
  }

  validateDateOfBirth(day: number, month: number, year: number): Date | false {
    const user = new User({
      password: '',
      firstname: '',
      phoneNumber: '',
      dateOfBirth: null,
      email: '',
      lastname: ''
    });
    return user.isValidDate(day, month, year);
  }
}
