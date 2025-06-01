import { inject, APP_INITIALIZER } from '@angular/core';
import { SessionStoreService } from '@app/core/store/session/session-store.service';

/**
 * Simple session initializer - loads existing session from storage on app start
 */
export function initializeSession(): () => void {
  const sessionStoreService = inject(SessionStoreService);

  return () => {
    // Load session data from storage
    sessionStoreService.loadSessionData();
    // Mark initialization as complete
    sessionStoreService.setInitialized();
  };
}

/**
 * Provider for the session initializer
 */
export const SESSION_INITIALIZER_PROVIDER = {
  provide: APP_INITIALIZER,
  useFactory: initializeSession,
  multi: true
};
