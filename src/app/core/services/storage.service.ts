import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Local Storage methods
   */
  setLocal(key: string, value: any): void {
    if (this.isStorageAvailable('localStorage')) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  getLocal<T>(key: string): T | null {
    if (this.isStorageAvailable('localStorage')) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  removeLocal(key: string): void {
    if (this.isStorageAvailable('localStorage')) {
      localStorage.removeItem(key);
    }
  }

  clearLocal(): void {
    if (this.isStorageAvailable('localStorage')) {
      localStorage.clear();
    }
  }

  /**
   * Session Storage methods
   */
  setSession(key: string, value: any): void {
    if (this.isStorageAvailable('sessionStorage')) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }
    }
  }

  getSession<T>(key: string): T | null {
    if (this.isStorageAvailable('sessionStorage')) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  removeSession(key: string): void {
    if (this.isStorageAvailable('sessionStorage')) {
      sessionStorage.removeItem(key);
    }
  }

  clearSession(): void {
    if (this.isStorageAvailable('sessionStorage')) {
      sessionStorage.clear();
    }
  }

  /**
   * Utility methods
   */
  hasLocal(key: string): boolean {
    return this.getLocal(key) !== null;
  }

  hasSession(key: string): boolean {
    return this.getSession(key) !== null;
  }

  /**
   * Check if storage is available
   */
  private isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage size
   */
  getStorageSize(type: 'localStorage' | 'sessionStorage' = 'localStorage'): number {
    if (!this.isStorageAvailable(type)) {
      return 0;
    }

    let total = 0;
    const storage = window[type];

    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        total += storage[key].length + key.length;
      }
    }

    return total;
  }
}
