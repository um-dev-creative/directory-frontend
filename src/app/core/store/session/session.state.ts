export interface SessionState {
  sessionData: SessionData;
  isInitialized: boolean;
}

export class SessionData {
  userAuth!: UserAuth;
  token!: string;
}

export class UserAuth {
  alias!: string;
  email!: string;
  fullName!: string;
  sessionToken!: string;
  sessionTokenBkd!: string;
  authorization!: string;
  features!: string[];
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
      features: []
    },
    token: ''
  },
  isInitialized: false
};


