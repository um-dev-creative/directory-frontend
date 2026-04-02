import { inject, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SessionStoreService } from '@app/core/store/session/session-store.service';

/**
 * Async session initializer - loads existing session from storage on app start.
 * In SSR, skips localStorage access and marks initialized immediately.
 * In browser, dispatches loadSession and yields one macrotask so the NgRx effect
 * can process it (read localStorage, dispatch saveSession) before marking initialized.
 */
export function initializeSession(): () => Promise<void> {
  const sessionStoreService = inject(SessionStoreService);
  const platformId = inject(PLATFORM_ID);

  return () => {
    console.debug(`[SessionInitializer] start | ts=${new Date().toISOString()} | platform=${isPlatformBrowser(platformId) ? 'browser' : 'server'}`);

    // SSR: browser-only — no localStorage in Node
    if (!isPlatformBrowser(platformId)) {
      console.debug(`[SessionInitializer] SSR detected, calling setInitialized immediately`);
      sessionStoreService.setInitialized();
      return Promise.resolve();
    }

    sessionStoreService.loadSessionData();

    return new Promise<void>(resolve => {
      setTimeout(() => {
        console.debug(`[SessionInitializer] setTimeout resolved, calling setInitialized | ts=${new Date().toISOString()}`);
        sessionStoreService.setInitialized();
        resolve();
      }, 0);
    });
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
