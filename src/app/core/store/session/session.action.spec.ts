import {saveSession} from './session.action';
import {SessionData} from './session.state';

describe('App Actions', () => {
    it('should create setSharedData action with correct type and payload', () => {
        const data: SessionData = {userAuth: {
            alias: 'testAlias',
            fullName: '',
            sessionTokenBkd: '',
            sessionToken: '',
            features: [],
            email: '',
            authorization: '',
            businesses: []
          },
            token: 'true'
        };
        const action = saveSession({sessionData: data, isInitialized: true});
        expect(action.type).toBe('[Session] Save session');
        expect(action.sessionData).toEqual(data);
    });

    it('should handle empty data payload', () => {
        const data: SessionData = new SessionData();
        const action = saveSession({sessionData: data, isInitialized: true});
        expect(action.type).toBe('[Session] Save session');
        expect(action.sessionData).toEqual(data);
    });

});
