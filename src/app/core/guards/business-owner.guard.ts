import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionState } from '@app/core/store/session/session.state';
import { filter, switchMap, take } from 'rxjs/operators';

export const businessOwnerGuard: CanActivateFn = (route) => {
  const store = inject(Store<{ session: SessionState }>);
  const router = inject(Router);
  const businessId = route.paramMap.get('id') ?? '';

  return store.select(state => state.session).pipe(
    filter(s => s?.isInitialized === true),
    take(1),
    switchMap(sessionState => {
      const { userAuth, token } = sessionState.sessionData;

      if (!token?.trim() || !userAuth?.sessionToken?.trim() || !userAuth?.alias?.trim()) {
        router.navigate(['/auth']);
        return [false];
      }

      const isOwner = userAuth.businesses?.includes(businessId) ?? false;

      if (!isOwner) {
        router.navigate(['/partner', businessId]);
        return [false];
      }

      return [true];
    })
  );
};
