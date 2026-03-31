import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show and hide loading for a specific key', () => {
    service.show('test-key');
    expect(service.isLoading('test-key')).toBeTrue();
    expect(service.isAnyLoading()).toBeTrue();

    service.hide('test-key');
    expect(service.isLoading('test-key')).toBeFalse();
    expect(service.isAnyLoading()).toBeFalse();
  });

  it('should use default key when none specified', () => {
    service.show();
    expect(service.isLoading()).toBeTrue();

    service.hide();
    expect(service.isLoading()).toBeFalse();
  });

  it('should handle multiple loading keys independently', () => {
    service.show('key1');
    service.show('key2');

    expect(service.isLoading('key1')).toBeTrue();
    expect(service.isLoading('key2')).toBeTrue();
    expect(service.isAnyLoading()).toBeTrue();

    service.hide('key1');
    expect(service.isLoading('key1')).toBeFalse();
    expect(service.isLoading('key2')).toBeTrue();
    expect(service.isAnyLoading()).toBeTrue();

    service.hide('key2');
    expect(service.isAnyLoading()).toBeFalse();
  });

  it('should manage global loading via showGlobal/hideGlobal', (done) => {
    service.globalLoading$.subscribe(isLoading => {
      if (isLoading) {
        done();
      }
    });
    service.showGlobal();
  });

  it('should only hide global loading when all requests complete', () => {
    const values: boolean[] = [];
    service.globalLoading$.subscribe(val => values.push(val));

    service.showGlobal();
    service.showGlobal();
    service.hideGlobal();

    // Should still be loading (one request still pending)
    const lastVal = values[values.length - 1];
    expect(lastVal).toBeTrue();

    service.hideGlobal();
    const finalVal = values[values.length - 1];
    expect(finalVal).toBeFalse();
  });

  it('should not let requestCount go below 0', () => {
    service.hideGlobal();
    service.hideGlobal();
    // Should not throw and global loading should be false
    const values: boolean[] = [];
    service.globalLoading$.subscribe(val => values.push(val));
    expect(values[values.length - 1]).toBeFalse();
  });

  it('should clear all loading states', () => {
    service.show('key1');
    service.show('key2');
    service.showGlobal();

    service.clearAll();

    expect(service.isAnyLoading()).toBeFalse();
    expect(service.isLoading('key1')).toBeFalse();
    expect(service.isLoading('key2')).toBeFalse();
  });

  it('should emit loading state changes via loading$ observable', (done) => {
    const states: any[] = [];
    service.loading$.subscribe(state => {
      states.push(state);
      if (states.length === 3) {
        // Initial {}, then {myKey: true}, then {}
        expect(states[1]['myKey']).toBeTrue();
        expect(states[2]['myKey']).toBeUndefined();
        done();
      }
    });

    service.show('myKey');
    service.hide('myKey');
  });

  it('should support showSpecific/hideSpecific without affecting global loading', () => {
    const globalValues: boolean[] = [];
    service.globalLoading$.subscribe(val => globalValues.push(val));

    service.showSpecific('specific-key');
    expect(service.isLoading('specific-key')).toBeTrue();
    // Global should not have been triggered
    expect(globalValues.every(v => v === false)).toBeTrue();

    service.hideSpecific('specific-key');
    expect(service.isLoading('specific-key')).toBeFalse();
  });
});
