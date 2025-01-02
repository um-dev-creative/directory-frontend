import { CountryCode } from 'libphonenumber-js';

export interface Country {
  name: string;
  code: CountryCode;
  dialCode: string;
  flag: string;
  active: boolean;
}
export interface Month {
  number: number;
  name: string;
  abbr: string;
}
export const countries: Country[] = [
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '/assets/images/flags/ca.svg', active: true },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '/assets/images/flags/us.svg', active: true},
  { name: 'España', code: 'ES', dialCode: '+34', flag: '/assets/images/flags/es.svg', active: true },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '/assets/images/flags/cl.svg', active: true },
];
export const months: Month[] = [
  { number: 1, name: 'Enero', abbr: 'Ene' },
  { number: 2, name: 'Febrero', abbr: 'Feb' },
  { number: 3, name: 'Marzo', abbr: 'Mar' },
  { number: 4, name: 'Abril', abbr: 'Abr' },
  { number: 5, name: 'Mayo', abbr: 'May' },
  { number: 6, name: 'Junio', abbr: 'Jun' },
  { number: 7, name: 'Julio', abbr: 'Jul' },
  { number: 8, name: 'Agosto', abbr: 'Ago' },
  { number: 9, name: 'Septiembre', abbr: 'Sep' },
  { number: 10, name: 'Octubre', abbr: 'Oct' },
  { number: 11, name: 'Noviembre', abbr: 'Nov' },
  { number: 12, name: 'Diciembre', abbr: 'Dic' },
];

