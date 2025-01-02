export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  active: boolean;
  regex: RegExp;
}
export interface Month {
  number: number;
  name: string;
  abbr: string;
}
export const countries: Country[] = [
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', active: true, regex: /^(?:\+?1)?(?:\(?([2-9]\d{2})\)?[-\s]?)?([2-9]\d{2})[-\s]?(\d{4})$/},
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', active: true, regex: /^(?:\+?1)?(?:\(?([2-9]\d{2})\)?[-\s]?)?([2-9]\d{2})[-\s]?(\d{4})$/},
  { name: 'España', code: 'ES', dialCode: '+34', flag: '🇪🇸', active: false, regex: /^(?:\+?34)?[67]\d{8}$/},
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱', active: false, regex: /^(?:\+?56)?(?:9)(\d{8})$/},
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

