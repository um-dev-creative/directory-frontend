export class User {
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  phoneNumber?: string;

  constructor(data: {
    password: string;
    firstname: string;
    phoneNumber: string;
    dateOfBirth: Date | null;
    email: string;
    lastname: string
  }) {
    this.password = data.password || '';
    this.email = data.email || '';
    this.firstname = data.firstname || '';
    this.lastname = data.lastname || '';
    this.dateOfBirth = data.dateOfBirth || new Date();
    this.phoneNumber = data.phoneNumber || '';
  }

  // Método para formatear la fecha de nacimiento (returns 'YYYY-MM-DD')
  getFormattedDateOfBirth(): string {
    const date = new Date(this.dateOfBirth);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

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
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber,
    };
  }
}
