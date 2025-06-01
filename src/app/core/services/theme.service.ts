import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export interface Theme {
  name: string;
  displayName: string;
  className: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly DARK_MODE_KEY = 'dark-mode';

  private readonly themes: Theme[] = [
    { name: 'light', displayName: 'Light', className: 'light-theme' },
    { name: 'dark', displayName: 'Dark', className: 'dark-theme' }
  ];

  private readonly  currentThemeSubject = new BehaviorSubject<Theme>(this.themes[0]);
  private readonly isDarkModeSubject = new BehaviorSubject<boolean>(false);

  public currentTheme$: Observable<Theme> = this.currentThemeSubject.asObservable();
  public isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor(private readonly storageService: StorageService) {
    this.initializeTheme();
  }

  /**
   * Initialize theme from storage or system preference
   */
  private initializeTheme(): void {
    // Check stored theme preference
    const storedTheme = this.storageService.getLocal<string>(this.THEME_KEY);
    const storedDarkMode = this.storageService.getLocal<boolean>(this.DARK_MODE_KEY);

    if (storedTheme) {
      const theme = this.themes.find(t => t.name === storedTheme);
      if (theme) {
        this.setTheme(theme);
      }
    } else if (storedDarkMode !== null) {
      this.setDarkMode(storedDarkMode);
    } else {
      // Check system preference
      this.setDarkMode(this.getSystemPreference());
    }
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    this.storageService.setLocal(this.THEME_KEY, theme.name);
    this.applyThemeToDocument(theme);

    // Update dark mode based on theme
    const isDark = theme.name === 'dark';
    this.isDarkModeSubject.next(isDark);
    this.storageService.setLocal(this.DARK_MODE_KEY, isDark);
  }

  /**
   * Set dark mode
   */
  setDarkMode(isDark: boolean): void {
    const theme = this.themes.find(t => t.name === (isDark ? 'dark' : 'light'));
    if (theme) {
      this.setTheme(theme);
    }
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    const current = this.isDarkModeSubject.value;
    this.setDarkMode(!current);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  /**
   * Get available themes
   */
  getThemes(): Theme[] {
    return [...this.themes];
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  /**
   * Apply theme to document
   */
  private applyThemeToDocument(theme: Theme): void {
    if (typeof document !== 'undefined') {
      // Remove existing theme classes
      this.themes.forEach(t => {
        document.body.classList.remove(t.className);
      });

      // Add new theme class
      document.body.classList.add(theme.className);

      // Set data attribute for CSS
      document.body.setAttribute('data-theme', theme.name);
    }
  }

  /**
   * Get system dark mode preference
   */
  private getSystemPreference(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  /**
   * Listen to system theme changes
   */
  listenToSystemChanges(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't set a manual preference
        const storedTheme = this.storageService.getLocal<string>(this.THEME_KEY);
        if (!storedTheme) {
          this.setDarkMode(e.matches);
        }
      });
    }
  }
}
