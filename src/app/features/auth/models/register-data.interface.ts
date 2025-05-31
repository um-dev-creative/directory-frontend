export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  phoneNumber: string;
  birthMonth: number | null;
  birthDay: number | null;
  birthYear: number | null;
  birthdayFull: Date | null;
}
