import {createAction, props} from '@ngrx/store';
import {SessionData} from './session.state';

export const saveSession = createAction(
    '[Session] Save session',
    props<{ data: SessionData; token: string }>()
);

export const clearSession = createAction(('[Session] Clear session'));

export const loadSession = createAction('[Session] Load Session');
