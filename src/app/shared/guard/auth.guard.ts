import {CanActivateFn} from '@angular/router';
import {Store} from "@ngrx/store";
import {SessionData} from "@shared/state/session.state";
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const store: Store<{ app: SessionData }> = inject(Store);
    const sessionData = store.select(state => state.app);
    let isAuthenticated = false;
    if (sessionData) {
      sessionData.subscribe(data => {
            isAuthenticated = data.userAuth !== null && data.userAuth !== undefined;
        });
    } else {
      isAuthenticated = false;
    }
    return isAuthenticated;
};
