import {createAction, props} from '@ngrx/store';
import {SessionState} from './session.state';

export const saveSession = createAction(
    '[Session] Save session',
    props<SessionState>()
);

export const clearSession = createAction(('[Session] Clear session'));

export const loadSession = createAction('[Session] Load Session');
