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
  fullName!: string;
  sessionToken!: string;
  sessionTokenBkd!: string;
  authorization!: string;
  features!: string[];
  // Optional field for user avatar URL
  verifiedComplete?: boolean;
  avatarUrl?: string;
}

export const initialState: SessionState = {
  sessionData: {
    userAuth: {
      alias: '',
      email: '',
      fullName: '',
      sessionToken: '',
      sessionTokenBkd: '',
      authorization: '',
      features: [],
      verifiedComplete: false,
      avatarUrl: ''
    },
    token: ''
  },
  isInitialized: false
};


