import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({});
  private globalLoadingSubject = new BehaviorSubject<boolean>(false);

  public loading$: Observable<LoadingState> = this.loadingSubject.asObservable();
  public globalLoading$: Observable<boolean> = this.globalLoadingSubject.asObservable();

  private loadingState: LoadingState = {};
  private requestCount = 0;

  /**
   * Show loading for a specific key
   */
  show(key: string = 'default'): void {
    this.loadingState[key] = true;
    this.loadingSubject.next({ ...this.loadingState });
    this.updateGlobalLoading();
  }

  /**
   * Hide loading for a specific key
   */
  hide(key: string = 'default'): void {
    delete this.loadingState[key];
    this.loadingSubject.next({ ...this.loadingState });
    this.updateGlobalLoading();
  }

  /**
   * Check if loading for a specific key
   */
  isLoading(key: string = 'default'): boolean {
    return !!this.loadingState[key];
  }

  /**
   * Check if any loading is active
   */
  isAnyLoading(): boolean {
    return Object.keys(this.loadingState).length > 0;
  }

  /**
   * Show global loading (for HTTP interceptor)
   */
  showGlobal(): void {
    this.requestCount++;
    this.globalLoadingSubject.next(true);
  }

  /**
   * Hide global loading (for HTTP interceptor)
   */
  hideGlobal(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this.globalLoadingSubject.next(false);
    }
  }

  /**
   * Clear all loading states
   */
  clearAll(): void {
    this.loadingState = {};
    this.requestCount = 0;
    this.loadingSubject.next({});
    this.globalLoadingSubject.next(false);
  }

  private updateGlobalLoading(): void {
    const hasAnyLoading = this.isAnyLoading();
    if (this.requestCount === 0) {
      this.globalLoadingSubject.next(hasAnyLoading);
    }
  }
}
