import { TestBed } from '@angular/core/testing';
import { initializeSession, SESSION_INITIALIZER_PROVIDER } from './session.initializer';
import { SessionStoreService } from '@app/core/store/session/session-store.service';
import { APP_INITIALIZER } from '@angular/core';

describe('Session Initializer', () => {
  let mockSessionStore: jasmine.SpyObj<SessionStoreService>;

  beforeEach(() => {
    mockSessionStore = jasmine.createSpyObj('SessionStoreService', [
      'loadSessionData',
      'setInitialized'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionStoreService, useValue: mockSessionStore }
      ]
    });
  });

  describe('initializeSession', () => {
    it('should return a function', () => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      expect(typeof fn).toBe('function');
    });

    it('should call loadSessionData when executed', () => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      fn();

      expect(mockSessionStore.loadSessionData).toHaveBeenCalled();
    });

    it('should call setInitialized when executed', () => {
      const fn = TestBed.runInInjectionContext(() => initializeSession());
      fn();

      expect(mockSessionStore.setInitialized).toHaveBeenCalled();
    });

    it('should call loadSessionData before setInitialized', () => {
      const callOrder: string[] = [];
      mockSessionStore.loadSessionData.and.callFake(() => callOrder.push('load'));
      mockSessionStore.setInitialized.and.callFake(() => callOrder.push('init'));

      const fn = TestBed.runInInjectionContext(() => initializeSession());
      fn();

      expect(callOrder).toEqual(['load', 'init']);
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
