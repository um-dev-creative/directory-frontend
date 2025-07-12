export class User {
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  displayName: string;
  dateOfBirth: Date;
  phoneNumber?: string;
  notificationEmail?: boolean;
  notificationSms?: boolean;
  privacyDataOutputActive?: boolean;

  constructor(data: {
    password: string;
    firstname: string;
    phoneNumber: string;
    dateOfBirth: Date | null;
    email: string;
    lastname: string
    displayName: string;
    notificationEmail?: boolean;
    notificationSms?: boolean;
    privacyDataOutputActive?: boolean;
  }) {
    this.password = data.password || '';
    this.email = data.email || '';
    this.firstname = data.firstname || '';
    this.lastname = data.lastname || '';
    this.dateOfBirth = data.dateOfBirth || new Date();
    this.phoneNumber = data.phoneNumber || '';
    this.displayName = data.displayName || `${data.firstname} ${data.lastname}`;
    this.notificationEmail = data.notificationEmail ?? true;
    this.notificationSms = data.notificationSms ?? true;
    this.privacyDataOutputActive = data.privacyDataOutputActive ?? true;
  }

  // Método para formatear la fecha de nacimiento (returns 'YYYY-MM-DD')
  getFormattedDateOfBirth(): string {
    const date = new Date(this.dateOfBirth);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  // Método para validar la fecha de nacimiento 15-110 años
  isValidDate(day: number, month: number, year: number): Date | false {
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
      return false;
    }
    const date: Date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      return false;
    }
    const currentDate: Date = new Date();
    let age: number = currentDate.getFullYear() - date.getFullYear();

    const currentMonth: number = currentDate.getMonth();
    const birthMonth: number = month - 1;

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDate.getDate() < day)
    ) {
      age--;
    }

    if (age < 15 || age > 110) {
      return false;
    }
    return date;
  }

  isValid(): boolean {
    return (
      !!this.password &&
      !!this.email &&
      !!this.firstname &&
      !!this.lastname &&
      !!this.dateOfBirth
    );
  }

  toApiFormat(): any {
    return {
      password: this.password,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      displayName: this.displayName,
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber,
      notificationEmail: this.notificationEmail,
      notificationSms: this.notificationSms,
      privacyDataOutputActive: this.privacyDataOutputActive
    };
  }
}
