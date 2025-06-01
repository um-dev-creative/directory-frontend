import { AuthPlaceholders } from './models/auth-placeholders.interface';
import { DropdownState } from './models/dropdown-state.interface';

export const INITIAL_PLACEHOLDERS: AuthPlaceholders = {
  day: 'Dia',
  year: 'Año',
  email: 'Email Address',
  mobile: 'Mobile Number (optional)',
};

export const INITIAL_DROPDOWN_STATE: DropdownState = {
  country: false,
  month: false,
};

export const DEFAULT_COUNTRY_CODE = 'CA';

export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
} as const;
