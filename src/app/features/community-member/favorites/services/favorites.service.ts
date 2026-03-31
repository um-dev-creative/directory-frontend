/**
 * Favorites Service
 *
 * This service handles all favorites-related operations including:
 * - Fetching user's favorite items
 * - Adding items to favorites
 * - Removing items from favorites
 * - Checking if an item is favorited
 *
 * The service integrates with the backend API and provides observable streams
 * for reactive programming patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FavoriteItem } from '../favorites';

export interface AddToFavoritesRequest {
  itemId: string;
  itemType: 'offer' | 'product' | 'business';
  title: string;
  description?: string;
  imageUrl?: string;
  businessName?: string;
  price?: string;
  originalPrice?: string;
  discount?: number;
  location?: string;
  rating?: number;
  slug?: string;
}

export interface FavoritesResponse {
  favorites: FavoriteItem[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  

  /**
   * Fetches user's favorite items from the backend
   */
  getFavorites(): Observable<FavoriteItem[]> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<FavoritesResponse>(`${this.apiUrl}`)
    //   .pipe(
    //     map(response => response.favorites),
    //     catchError(error => {
    //       console.error('Error fetching favorites:', error);
    //       return of([]);
    //     })
    //   );

    // Mock implementation for now
    const mockFavorites: FavoriteItem[] = [
      {
        id: '1',
        type: 'offer',
        title: 'Descuento 50% en Pizza Familiar',
        description: 'Deliciosa pizza familiar con ingredientes frescos',
        imageUrl: '/assets/images/mock/pizza-offer.jpg',
        businessName: 'Pizzería Don Giuseppe',
        price: '$15.99',
        originalPrice: '$31.98',
        discount: 50,
        location: 'Centro Histórico',
        rating: 4.5,
        dateAdded: new Date('2024-01-15'),
        slug: 'pizza-familiar-50-descuento'
      },
      {
        id: '2',
        type: 'business',
        title: 'Restaurante El Jardín',
        description: 'Restaurante de comida internacional con ambiente familiar',
        imageUrl: '/assets/images/mock/restaurant.jpg',
        location: 'Zona Rosa',
        rating: 4.8,
        dateAdded: new Date('2024-01-10'),
        slug: 'restaurante-el-jardin'
      }
    ];

    return of(mockFavorites).pipe(
      map(favorites => {
        this.favoritesSubject.next(favorites);
        return favorites;
      })
    );
  }

  /**
   * Adds an item to user's favorites
   */
  addToFavorites(request: AddToFavoritesRequest): Observable<boolean> {
    // TODO: Replace with actual HTTP call
    // return this.http.post<{ success: boolean }>(`${this.apiUrl}`, request)
    //   .pipe(
    //     map(response => response.success),
    //     catchError(error => {
    //       console.error('Error adding to favorites:', error);
    //       return of(false);
    //     })
    //   );

    // Mock implementation
    const newFavorite: FavoriteItem = {
      id: request.itemId,
      type: request.itemType,
      title: request.title,
      description: request.description || '',
      imageUrl: request.imageUrl,
      businessName: request.businessName,
      price: request.price,
      originalPrice: request.originalPrice,
      discount: request.discount,
      location: request.location,
      rating: request.rating,
      dateAdded: new Date(),
      slug: request.slug
    };

    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = [...currentFavorites, newFavorite];
    this.favoritesSubject.next(updatedFavorites);

    return of(true);
  }

  /**
   * Removes an item from user's favorites
   */
  removeFromFavorites(itemId: string): Observable<boolean> {
    // TODO: Replace with actual HTTP call
    // return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${itemId}`)
    //   .pipe(
    //     map(response => response.success),
    //     catchError(error => {
    //       console.error('Error removing from favorites:', error);
    //       return of(false);
    //     })
    //   );

    // Mock implementation
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(item => item.id !== itemId);
    this.favoritesSubject.next(updatedFavorites);

    return of(true);
  }

  /**
   * Checks if an item is in user's favorites
   */
  isFavorite(itemId: string): Observable<boolean> {
    return this.favorites$.pipe(
      map(favorites => favorites.some(item => item.id === itemId))
    );
  }

  /**
   * Gets the count of favorites by type
   */
  getFavoriteCount(type?: 'offer' | 'product' | 'business'): Observable<number> {
    return this.favorites$.pipe(
      map(favorites => {
        if (!type) {
          return favorites.length;
        }
        return favorites.filter(item => item.type === type).length;
      })
    );
  }

  /**
   * Clears all favorites (for testing or user preference)
   */
  clearAllFavorites(): Observable<boolean> {
    // TODO: Replace with actual HTTP call
    // return this.http.delete<{ success: boolean }>(`${this.apiUrl}/all`)
    //   .pipe(
    //     map(response => response.success),
    //     catchError(error => {
    //       console.error('Error clearing favorites:', error);
    //       return of(false);
    //     })
    //   );

    // Mock implementation
    this.favoritesSubject.next([]);
    return of(true);
  }

  /**
   * Gets current favorites synchronously (for immediate access)
   */
  getCurrentFavorites(): FavoriteItem[] {
    return this.favoritesSubject.value;
  }
}
