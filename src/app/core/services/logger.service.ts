import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.INFO;
  private enableConsoleLogging = true;

  constructor() {
    // Set log level based on environment
    if (typeof window !== 'undefined') {
      this.logLevel = this.isProduction() ? LogLevel.ERROR : LogLevel.DEBUG;
    }
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.DEBUG, message, optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.INFO, message, optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.WARN, message, optionalParams);
  }

  error(message: string, error?: any, ...optionalParams: any[]): void {
    this.log(LogLevel.ERROR, message, [error, ...optionalParams]);
  }

  private log(level: LogLevel, message: string, optionalParams: any[]): void {
    if (level < this.logLevel || !this.enableConsoleLogging) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${LogLevel[level]}: ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, ...optionalParams);
        break;
      case LogLevel.INFO:
        console.info(logMessage, ...optionalParams);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, ...optionalParams);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, ...optionalParams);
        break;
    }
  }

  private isProduction(): boolean {
    // Check if we're in production environment
    return typeof window !== 'undefined' &&
           (window.location.hostname === 'your-production-domain.com' ||
            window.location.hostname.includes('prod'));
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  enableConsole(enable: boolean): void {
    this.enableConsoleLogging = enable;
  }
}
