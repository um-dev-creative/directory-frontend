import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService]
    });
    service = TestBed.inject(LoggerService);
    // Enable all log levels for testing
    service.setLogLevel(LogLevel.DEBUG);
    service.enableConsole(true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log debug messages', () => {
    spyOn(console, 'debug');
    service.debug('test debug message');
    expect(console.debug).toHaveBeenCalled();
  });

  it('should log info messages', () => {
    spyOn(console, 'info');
    service.info('test info message');
    expect(console.info).toHaveBeenCalled();
  });

  it('should log warn messages', () => {
    spyOn(console, 'warn');
    service.warn('test warning message');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    spyOn(console, 'error');
    service.error('test error message', new Error('test'));
    expect(console.error).toHaveBeenCalled();
  });

  it('should not log below current log level', () => {
    service.setLogLevel(LogLevel.ERROR);
    spyOn(console, 'debug');
    spyOn(console, 'info');
    spyOn(console, 'warn');

    service.debug('should not appear');
    service.info('should not appear');
    service.warn('should not appear');

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should still log error when level is ERROR', () => {
    service.setLogLevel(LogLevel.ERROR);
    spyOn(console, 'error');
    service.error('should appear');
    expect(console.error).toHaveBeenCalled();
  });

  it('should not log when console logging is disabled', () => {
    service.enableConsole(false);
    spyOn(console, 'debug');
    spyOn(console, 'info');
    spyOn(console, 'error');

    service.debug('no output');
    service.info('no output');
    service.error('no output');

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should include timestamp in log messages', () => {
    spyOn(console, 'info');
    service.info('timestamp check');
    const loggedMessage = (console.info as jasmine.Spy).calls.mostRecent().args[0];
    // Should contain ISO date format
    expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
  });

  it('should include log level name in messages', () => {
    spyOn(console, 'warn');
    service.warn('level check');
    const loggedMessage = (console.warn as jasmine.Spy).calls.mostRecent().args[0];
    expect(loggedMessage).toContain('WARN');
  });
});
