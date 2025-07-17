export interface Timezone {
  value: string;
  label: string;
}

export const TIMEZONES: Timezone[] = [
  { value: 'PST', label: '(GMT -8:00) Hora del Pacífico (EE.UU. y Canadá)' },
  { value: 'CST', label: '(GMT -6:00) Hora Central (EE.UU. y Canadá), Ciudad de México' },
  { value: 'EST', label: '(GMT -5:00) Hora del Este (EE.UU. y Canadá), Bogotá, Lima' },
  { value: 'MST', label: '(GMT -7:00) Hora de la Montaña (EE.UU. y Canadá)' },
  { value: 'COT', label: '(GMT -5:00) Hora de Colombia' },
  { value: 'PET', label: '(GMT -5:00) Hora de Perú' },
  { value: 'ECT', label: '(GMT -5:00) Hora de Ecuador' },
  { value: 'VET', label: '(GMT -4:00) Hora de Venezuela' }
];
