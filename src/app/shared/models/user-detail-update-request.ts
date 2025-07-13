export interface UserDetailUpdateRequest {
  firstName: string;
  lastName: string;
  displayName: string;
  notificationEmail: boolean;
  notificationSms: boolean;
  privacyDataOutActive: boolean;
  phoneId: string;
  phoneNumber: string;
  roleIds: string[];
  active: string;
}

