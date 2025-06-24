interface ProfileData {
  email: string,
  firstName: string,
  lastName: string,
  displayName: string,
  phoneId: string,
  phone: string,
  birthDate: {
    month: string,
    day: string,
    year: string
  },
  // avatar: null,
  avatar: string, // URL de un avatar de ejemplo
  emailConfirmed: boolean,
  privacyOptOut: boolean,
  notifications: {
    email: boolean,
    sms: boolean
  }
}
