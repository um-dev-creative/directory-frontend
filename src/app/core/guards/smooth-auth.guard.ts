import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionState } from '@app/core/store/session/session.state';
import { filter, map, take, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Guard más suave que espera la inicialización sin logs excesivos
 * y con una pequeña transición para evitar flash
 */
export const smoothAuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<{ session: SessionState }>);
  const router = inject(Router);

  return store.select(storeState => storeState.session).pipe(
    // Esperar hasta que esté inicializado
    filter(sessionState => sessionState?.isInitialized === true),
    take(1),
    // Pequeño delay para transición suave
    delay(50),
    map(sessionState => {
      const sessionData = sessionState.sessionData;

      // Validar autenticación
      const isAuthenticated = !!(
        sessionData?.token &&
        sessionData.token.trim() !== '' &&
        sessionData.userAuth?.sessionToken &&
        sessionData.userAuth.sessionToken.trim() !== '' &&
        sessionData.userAuth?.alias &&
        sessionData.userAuth.alias.trim() !== ''
      );

      if (!isAuthenticated) {
        router.navigate(['/auth']);
        return false;
      }

      return true;
    })
  );
};
