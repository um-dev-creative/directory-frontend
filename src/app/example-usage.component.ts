import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';

// Core Services
import {
  HttpService,
  LoggerService,
  LoadingService,
  NotificationService,
  StorageMockService,
  ThemeService
} from './core/services';

@Component({
  selector: 'app-example-usage',
  template: `
    <div class="example-container">
      <h2>Core Services Example</h2>

      <!-- Environment Variable Display -->
      <p>API URL: {{ apiUrl }}</p>

      <!-- Theme Toggle -->
      <button (click)="toggleTheme()" class="theme-btn">
        {{ (themeService.isDarkMode$ | async) ? 'Switch to Light Theme' : 'Switch to Dark Theme' }}
      </button>

      <!-- Loading Example -->
      <button (click)="showLoading()" [disabled]="isLoading">
        {{ isLoading ? 'Loading...' : 'Test Loading' }}
      </button>

      <!-- Notification Examples -->
      <div class="notification-buttons">
        <button (click)="showSuccess()">Success</button>
        <button (click)="showError()">Error</button>
        <button (click)="showWarning()">Warning</button>
        <button (click)="showInfo()">Info</button>
      </div>

      <!-- Storage Example -->
      <div class="storage-example">
        <input #nameInput placeholder="Enter your name" />
        <button (click)="saveName(nameInput.value)">Save Name</button>
        <button (click)="loadName()">Load Name</button>
        <p *ngIf="savedName">Saved Name: {{ savedName }}</p>
      </div>

      <!-- Global Loading Indicator -->
      <div *ngIf="globalLoading$ | async" class="global-loading">
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .theme-btn, button {
      padding: 10px 20px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      background-color: var(--primary-color);
      color: white;
      cursor: pointer;
    }

    .notification-buttons {
      margin: 20px 0;
    }

    .storage-example {
      margin: 20px 0;
    }

    input {
      padding: 8px;
      margin: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  `]
})
export class ExampleUsageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = false;
  savedName = '';
  globalLoading$ = this.loadingService.globalLoading$;
  apiUrl = environment.apiUrl;

  constructor(
    private httpService: HttpService,
    private logger: LoggerService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private storageService: StorageMockService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.logger.info('ExampleUsageComponent initialized');

    // Subscribe to loading changes
    this.loadingService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loadingState => {
        this.isLoading = loadingState['example'] || false;
      });

    // Load saved name on init
    this.loadName();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
    this.logger.info('Theme toggled');
  }

  showLoading(): void {
    this.loadingService.show('example');
    this.logger.debug('Loading started');

    // Simulate async operation
    setTimeout(() => {
      this.loadingService.hide('example');
      this.notificationService.success('Operation completed!');
      this.logger.debug('Loading finished');
    }, 2000);
  }

  showSuccess(): void {
    this.notificationService.success('This is a success message!');
    this.logger.info('Success notification shown');
  }

  showError(): void {
    this.notificationService.error('This is an error message!');
    this.logger.error('Error notification shown');
  }

  showWarning(): void {
    this.notificationService.warning('This is a warning message!');
    this.logger.warn('Warning notification shown');
  }

  showInfo(): void {
    this.notificationService.info('This is an info message!');
    this.logger.info('Info notification shown');
  }

  saveName(name: string): void {
    if (name.trim()) {
      this.storageService.setLocal('userName', name);
      this.savedName = name;
      this.notificationService.success('Name saved successfully!');
      this.logger.info('Name saved to storage', { name });
    }
  }

  loadName(): void {
    const name = this.storageService.getLocal<string>('userName');
    if (name) {
      this.savedName = name;
      this.logger.info('Name loaded from storage', { name });
    }
  }

  // Example HTTP call
  async exampleHttpCall(): Promise<void> {
    try {
      this.loadingService.showGlobal();

      // Example GET request
      const data = await this.httpService.get('/api/example').toPromise();
      this.logger.info('HTTP call successful', data);
      this.notificationService.success('Data loaded successfully!');

    } catch (error) {
      this.logger.error('HTTP call failed', error);
      this.notificationService.error('Failed to load data');
    } finally {
      this.loadingService.hideGlobal();
    }
  }
}
