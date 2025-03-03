import {saveSession} from './session.action';
import {SessionData} from './session.state';

describe('App Actions', () => {
    it('should create setSharedData action with correct type and payload', () => {
        const data: SessionData = {userAuth: {
                alias: 'testAlias',
                fullName: '',
                sessionTokenBkd: '',
                sessionToken: '',
                features: []
            },
            token: 'true'
        };
        const action = saveSession({data: data, token:  'de07c1fd-7451-46b5-81e4-8c1ba3ba5263'});
        expect(action.type).toBe('[Session] Save session');
        expect(action.data).toEqual(data);
    });

    it('should handle empty data payload', () => {
        const data: SessionData = new SessionData();
        const action = saveSession({data: data, token:  'de07c1fd-7451-46b5-81e4-8c1ba3ba5263'});
        expect(action.type).toBe('[Session] Save session');
        expect(action.data).toEqual(data);
    });

});
