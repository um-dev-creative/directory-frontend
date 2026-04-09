export interface SessionState {
  sessionData: SessionData;
  isInitialized: boolean;
}

export class SessionData {
  userAuth!: UserAuth;
  token!: string;
  business?: BusinessData;
}

export class BusinessData {
  id!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class UserAuth {
  alias!: string;
  email!: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  fullName!: string;
  sessionToken!: string;
  sessionTokenBkd!: string;
  authorization!: string;
  features!: string[];
  businesses!: string[];
  // Optional field for user avatar URL
  verifiedComplete?: boolean;
  avatarUrl?: string;
  avatarVersion?: string;
  initials?: string;
}

export const initialState: SessionState = {
  sessionData: {
    userAuth: {
      alias: '',
      email: '',
      firstName: '',
      lastName: '',
      displayName: '',
      fullName: '',
      sessionToken: '',
      sessionTokenBkd: '',
      authorization: '',
      features: [],
      businesses: [],
      verifiedComplete: false,
      avatarUrl: '',
      avatarVersion: '',
      initials: ''
    },
    token: ''
  },
  isInitialized: false
};


