import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NotificationService } from './notification.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

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
      imports: [TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}})],
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
      imports: [TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}})],
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

describe('NotificationService messages', () => {
  let service: NotificationService;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}})],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
    });
    service = TestBed.inject(NotificationService);
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', {notifications: {welcome: '¡Bienvenido, {{name}}!'}});
    translate.setTranslation('en', {notifications: {welcome: 'Welcome, {{name}}!'}});
  });

  it('shows a plain string as it is (for example a message that comes from the backend)', () => {
    expect(service['resolve']('Something the server said')).toBe('Something the server said');
  });

  it('translates a key with its parameters in the current language', () => {
    translate.use('es');
    expect(service['resolve']({key: 'notifications.welcome', params: {name: 'Ana'}})).toBe('¡Bienvenido, Ana!');
    translate.use('en');
    expect(service['resolve']({key: 'notifications.welcome', params: {name: 'Ana'}})).toBe('Welcome, Ana!');
  });

  it('shows the key itself when it has no translation, so a missing text is visible', () => {
    translate.use('en');
    expect(service['resolve']({key: 'notifications.missing'})).toBe('notifications.missing');
  });

  it('accepts a key in every method that shows a message without failing on the server', () => {
    const text = {key: 'notifications.welcome', params: {name: 'Ana'}};
    expect(() => {
      service.success(text);
      service.error(text);
      service.warning(text);
      service.info(text);
      service.errorWithReport(text);
      service.errorWithExternalLink(text, 'https://example.test', 'link');
      service.showWithAction(text, 'undo');
    }).not.toThrow();
  });
});

describe('NotificationService and TranslateService (circular dependency)', () => {
  it('does not create TranslateService when it is created, only when a message with a key is resolved (NG0200 while prerendering)', () => {
    let created = 0;
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: TranslateService, useFactory: () => { created++; return { instant: (key: string) => `t:${key}` }; } }
      ]
    });
    const service = TestBed.inject(NotificationService);
    expect(created).toBe(0);
    expect(service['resolve']('plain text')).toBe('plain text');
    expect(created).toBe(0);
    expect(service['resolve']({key: 'a.b'})).toBe('t:a.b');
    expect(created).toBe(1);
  });
});
