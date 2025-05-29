import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { 
  AuthService, 
  NotificationService, 
  ThemeService, 
  LoadingService,
  LoggerService 
} from './core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-core-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="demo-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Core Services Demo</mat-card-title>
          <mat-card-subtitle>Prueba los servicios principales</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Auth Status -->
          <div class="section">
            <h3>Authentication Status</h3>
            <p>Authenticated: {{ (authService.isAuthenticated$ | async) ? 'Yes' : 'No' }}</p>
            <p *ngIf="authService.getCurrentUser() as user">
              Welcome, {{ user.name }}!
            </p>
          </div>

          <!-- Theme Toggle -->
          <div class="section">
            <h3>Theme</h3>
            <button mat-raised-button color="primary" (click)="toggleTheme()">
              {{ (themeService.isDarkMode$ | async) ? 'Switch to Light' : 'Switch to Dark' }}
            </button>
          </div>

          <!-- Loading Demo -->
          <div class="section">
            <h3>Loading</h3>
            <button 
              mat-raised-button 
              color="accent" 
              (click)="showLoading()"
              [disabled]="isLoading$ | async">
              {{ (isLoading$ | async) ? 'Loading...' : 'Test Loading' }}
            </button>
          </div>

          <!-- Notifications -->
          <div class="section">
            <h3>Notifications</h3>
            <div class="button-group">
              <button mat-button (click)="showSuccess()">Success</button>
              <button mat-button (click)="showError()">Error</button>
              <button mat-button (click)="showWarning()">Warning</button>
              <button mat-button (click)="showInfo()">Info</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }
    
    .section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    h3 {
      margin-top: 0;
      color: var(--primary-color);
    }
  `]
})
export class CoreDemoComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private logger: LoggerService
  ) {
    this.isLoading$ = this.loadingService.globalLoading$;
  }

  ngOnInit(): void {
    this.logger.info('CoreDemoComponent initialized');
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
    this.logger.info('Theme toggled');
  }

  showLoading(): void {
    this.loadingService.showGlobal();
    
    // Simulate async operation
    setTimeout(() => {
      this.loadingService.hideGlobal();
      this.notificationService.success('Operation completed!');
    }, 2000);
  }

  showSuccess(): void {
    this.notificationService.success('This is a success message!');
  }

  showError(): void {
    this.notificationService.error('This is an error message!');
  }

  showWarning(): void {
    this.notificationService.warning('This is a warning message!');
  }

  showInfo(): void {
    this.notificationService.info('This is an info message!');
  }
}
