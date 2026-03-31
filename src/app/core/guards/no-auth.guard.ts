import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionState } from '@app/core/store/session/session.state';
import { filter, map, take } from 'rxjs/operators';

/**
 * Guard that prevents authenticated users from accessing guest-only routes (e.g. /auth).
 * Redirects to /deals if the user already has a valid session.
 */
export const noAuthGuard: CanActivateFn = () => {
  const store = inject(Store<{ session: SessionState }>);
  const router = inject(Router);

  return store.select(state => state.session).pipe(
    filter(s => s?.isInitialized === true),
    take(1),
    map(s => {
      const userAuth = s?.sessionData?.userAuth;
      const token = s?.sessionData?.token;
      const isAuthenticated = !!(token && token.trim() && userAuth?.sessionToken?.trim() && userAuth?.alias?.trim());

      if (isAuthenticated) {
        router.navigate(['/deals']);
        return false;
      }
      return true;
    })
  );
};
