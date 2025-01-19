export interface SessionState {
  sessionData: SessionData;
}

export class SessionData {
  userAuth!: UserAuth;
  token!: string;
}

export class UserAuth {
  alias!: string;
  fullName!: string;
  sessionToken!: string;
  sessionTokenBkd!: string;
  features!: string[];
}

export const initialState: SessionState = {
  sessionData: {
    userAuth: {
      alias: '',
      fullName: '',
      sessionToken: '',
      sessionTokenBkd: '',
      features: []
    },
    token: ''
  }
};


