import { TestBed } from '@angular/core/testing';
import { StorageMockService } from './storage-mock.service';

describe('StorageMockService', () => {
  let service: StorageMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageMockService]
    });
    service = TestBed.inject(StorageMockService);
    // Clean up before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // LocalStorage tests
  describe('localStorage', () => {
    it('should set and get an item', () => {
      service.setLocal('testKey', { name: 'test' });
      const result = service.getLocal<{ name: string }>('testKey');
      expect(result).toEqual({ name: 'test' });
    });

    it('should return null for non-existent key', () => {
      expect(service.getLocal('nonExistent')).toBeNull();
    });

    it('should remove an item', () => {
      service.setLocal('removeMe', 'value');
      service.removeLocal('removeMe');
      expect(service.getLocal('removeMe')).toBeNull();
    });

    it('should clear all local storage', () => {
      service.setLocal('key1', 'value1');
      service.setLocal('key2', 'value2');
      service.clearLocal();
      expect(service.getLocal('key1')).toBeNull();
      expect(service.getLocal('key2')).toBeNull();
    });

    it('should check if key exists with hasLocal', () => {
      expect(service.hasLocal('key')).toBeFalse();
      service.setLocal('key', 'value');
      expect(service.hasLocal('key')).toBeTrue();
    });

    it('should store and retrieve string values', () => {
      service.setLocal('strKey', 'hello');
      expect(service.getLocal<string>('strKey')).toBe('hello');
    });

    it('should store and retrieve number values', () => {
      service.setLocal('numKey', 42);
      expect(service.getLocal<number>('numKey')).toBe(42);
    });

    it('should store and retrieve boolean values', () => {
      service.setLocal('boolKey', true);
      expect(service.getLocal<boolean>('boolKey')).toBeTrue();
    });
  });

  // SessionStorage tests
  describe('sessionStorage', () => {
    it('should set and get an item', () => {
      service.setSession('sessionKey', { data: 'test' });
      const result = service.getSession<{ data: string }>('sessionKey');
      expect(result).toEqual({ data: 'test' });
    });

    it('should return null for non-existent key', () => {
      expect(service.getSession('missing')).toBeNull();
    });

    it('should remove an item', () => {
      service.setSession('removeMe', 'value');
      service.removeSession('removeMe');
      expect(service.getSession('removeMe')).toBeNull();
    });

    it('should clear all session storage', () => {
      service.setSession('s1', 'v1');
      service.setSession('s2', 'v2');
      service.clearSession();
      expect(service.getSession('s1')).toBeNull();
    });

    it('should check if key exists with hasSession', () => {
      expect(service.hasSession('sKey')).toBeFalse();
      service.setSession('sKey', 'val');
      expect(service.hasSession('sKey')).toBeTrue();
    });
  });

  // Utility tests
  describe('getStorageSize', () => {
    it('should return size for localStorage', () => {
      service.setLocal('sizeTest', 'hello world');
      const size = service.getStorageSize('localStorage');
      expect(size).toBeGreaterThan(0);
    });

    it('should return size for sessionStorage', () => {
      service.setSession('sizeTest', 'hello world');
      const size = service.getStorageSize('sessionStorage');
      expect(size).toBeGreaterThan(0);
    });

    it('should return 0 for empty storage', () => {
      localStorage.clear();
      const size = service.getStorageSize('localStorage');
      expect(size).toBe(0);
    });
  });
});
