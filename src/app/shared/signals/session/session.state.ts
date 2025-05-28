export interface SessionState {
  sessionData: SessionData;
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
      features: []
    },
    token: ''
  }
};


