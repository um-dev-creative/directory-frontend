import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { initializeSession, SESSION_INITIALIZER_PROVIDER } from './session.initializer';
import { SessionStoreService } from '@app/core/store/session/session-store.service';
import { APP_INITIALIZER, PLATFORM_ID } from '@angular/core';

describe('Session Initializer', () => {
  let mockSessionStore: jasmine.SpyObj<SessionStoreService>;

  function configureTestBed(platformId: string) {
    mockSessionStore = jasmine.createSpyObj('SessionStoreService', [
      'loadSessionData',
      'setInitialized'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionStoreService, useValue: mockSessionStore },
        { provide: PLATFORM_ID, useValue: platformId }
      ]
    });
  }

  describe('initializeSession (browser)', () => {
    beforeEach(() => configureTestBed('browser'));

    it('should return a function that returns a Promise', () => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      expect(typeof fn).toBe('function');
      expect(fn()).toBeInstanceOf(Promise);
    });

    it('should call loadSessionData immediately', fakeAsync(() => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      fn();
      expect(mockSessionStore.loadSessionData).toHaveBeenCalled();
      tick(0);
    }));

    it('should call setInitialized after a tick', fakeAsync(() => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      fn();
      expect(mockSessionStore.setInitialized).not.toHaveBeenCalled();
      tick(0);
      expect(mockSessionStore.setInitialized).toHaveBeenCalled();
    }));

    it('should call loadSessionData before setInitialized', fakeAsync(() => {
      const callOrder: string[] = [];
      mockSessionStore.loadSessionData.and.callFake(() => callOrder.push('load'));
      mockSessionStore.setInitialized.and.callFake(() => callOrder.push('init'));

      const fn = TestBed.runInInjectionContext(() => initializeSession());
      fn();
      tick(0);

      expect(callOrder).toEqual(['load', 'init']);
    }));
  });

  describe('initializeSession (server / SSR)', () => {
    beforeEach(() => configureTestBed('server'));

    it('should call setInitialized immediately on SSR', async () => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      await fn();
      expect(mockSessionStore.setInitialized).toHaveBeenCalled();
    });

    it('should NOT call loadSessionData on SSR', async () => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      await fn();
      expect(mockSessionStore.loadSessionData).not.toHaveBeenCalled();
    });
  });

  describe('SESSION_INITIALIZER_PROVIDER', () => {
    it('should provide APP_INITIALIZER token', () => {
      expect(SESSION_INITIALIZER_PROVIDER.provide).toBe(APP_INITIALIZER);
    });

    it('should use initializeSession as factory', () => {
      expect(SESSION_INITIALIZER_PROVIDER.useFactory).toBe(initializeSession);
    });

    it('should set multi to true', () => {
      expect(SESSION_INITIALIZER_PROVIDER.multi).toBeTrue();
    });
  });
});
