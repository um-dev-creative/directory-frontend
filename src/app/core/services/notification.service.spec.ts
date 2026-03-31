import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockDocument: any;

  beforeEach(() => {
    mockDocument = {
      getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
      createElement: jasmine.createSpy('createElement').and.returnValue({
        id: '',
        className: '',
        appendChild: jasmine.createSpy('appendChild')
      }),
      body: {
        appendChild: jasmine.createSpy('appendChild')
      }
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have success method', () => {
    expect(typeof service.success).toBe('function');
  });

  it('should have error method', () => {
    expect(typeof service.error).toBe('function');
  });

  it('should have warning method', () => {
    expect(typeof service.warning).toBe('function');
  });

  it('should have info method', () => {
    expect(typeof service.info).toBe('function');
  });

  it('should have errorWithReport method', () => {
    expect(typeof service.errorWithReport).toBe('function');
  });

  it('should have errorWithExternalLink method', () => {
    expect(typeof service.errorWithExternalLink).toBe('function');
  });

  it('should have dismiss method', () => {
    expect(typeof service.dismiss).toBe('function');
  });

  it('should not throw when calling dismiss with no notifications', () => {
    expect(() => service.dismiss()).not.toThrow();
  });
});

describe('NotificationService (server platform)', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: DOCUMENT, useValue: { getElementById: () => null, createElement: () => ({}), body: { appendChild: () => {} } } }
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should not create components on server platform', () => {
    // show() exits early when not browser platform
    expect(() => service.show('test message')).not.toThrow();
  });
});
