import { Injectable } from '@angular/core';
import { getExampleNumber, Examples, PhoneNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { Country } from 'assets/data/common';

@Injectable({
  providedIn: 'root'
})
export class PlaceholderService {

  getFocusPlaceholder(field: string, selectedCountry?: Country): string {
    switch (field) {
      case 'day':
        return 'dd';
      case 'year':
        return 'yyyy';
      case 'email':
        return 'example@domain.com';
      case 'mobile':
        if (selectedCountry) {
          const focusPhoneNumber: PhoneNumber | undefined = getExampleNumber(
            selectedCountry.code,
            examples as Examples
          );
          return focusPhoneNumber
            ? focusPhoneNumber.formatNational()
            : selectedCountry.nationalTemplate;
        }
        return 'Mobile Number (optional)';
      default:
        return '';
    }
  }

  getBlurPlaceholder(field: string): string {
    switch (field) {
      case 'day':
        return 'Dia';
      case 'year':
        return 'Año';
      case 'email':
        return 'Email Address';
      case 'mobile':
        return 'Mobile Number (optional)';
      default:
        return '';
    }
  }
}
