import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, shareReplay } from 'rxjs/operators';

export interface CardImage {
  src: string;
  alt: string;
  id?: string;
  title?: string;
  description?: string;
  link?: string; // Permite enlaces opcionales en las tarjetas
}

interface CardsData {
  images: CardImage[];
}

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private readonly apiUrl = 'assets/mocks/images.json';
  private cache$ = new Map<string, Observable<CardImage[]>>();

  constructor(private readonly http: HttpClient) {}

  getCards(): Observable<CardImage[]> {
    // Implement simple caching
    if (this.cache$.has(this.apiUrl)) {
      return this.cache$.get(this.apiUrl)!;
    }

    const cards$ = this.http.get<CardsData>(this.apiUrl)
      .pipe(
        retry(2), // Retry failed requests up to 2 times
        map(data => data.images || []),
        shareReplay(1), // Share and replay the last emitted value
        catchError(this.handleError)
      );

    this.cache$.set(this.apiUrl, cards$);
    return cards$;
  }

  /**
   * Clear the cache (useful for testing or force refresh)
   */
  clearCache(): void {
    this.cache$.clear();
  }

  private handleError(error: any): Observable<never> {
    console.error('Cards loading error:', error);

    // You could implement more sophisticated error handling here
    // such as checking error types, network status, etc.
    let errorMessage = 'Failed to load cards';

    if (error.status === 0) {
      errorMessage = 'Network error - please check your connection';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = 'Cards data not found';
    } else if (error.status >= 500) {
      errorMessage = 'Server error - please try again later';
    }

    return throwError(() => new Error(errorMessage));
  }
}
