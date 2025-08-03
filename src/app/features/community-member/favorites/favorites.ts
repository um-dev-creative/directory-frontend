/**
 * Favorites Component
 *
 * This component manages the favorites functionality for community members.
 * It allows users to view, add, and remove their favorite offers, products, and businesses.
 *
 * Main Features:
 * - Displays a list of user's favorite items categorized by type (offers, products, businesses).
 * - Provides filtering and search functionality within favorites.
 * - Allows users to remove items from their favorites.
 * - Handles loading states and empty states.
 * - Integrates with the favorites service for backend operations.
 *
 * Key Methods:
 * - ngOnInit: Initializes the component and loads user favorites.
 * - loadFavorites: Fetches user's favorite items from the backend.
 * - removeFavorite: Removes an item from user's favorites.
 * - filterFavorites: Filters favorites by category or search term.
 * - navigateToItem: Navigates to the detailed view of a favorite item.
 *
 * Dependencies:
 * - Angular CommonModule and RouterModule.
 * - FavoritesService for backend API calls.
 * - HeaderService for UI header management.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FavoritesService } from './services';

// Types
export interface FavoriteItem {
  id: string;
  type: 'offer' | 'product' | 'business';
  title: string;
  description: string;
  imageUrl?: string;
  businessName?: string;
  price?: string;
  originalPrice?: string;
  discount?: number;
  location?: string;
  rating?: number;
  dateAdded: Date;
  slug?: string;
}

export enum FavoriteType {
  ALL = 'all',
  OFFERS = 'offer',
  PRODUCTS = 'product',
  BUSINESSES = 'business'
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class Favorites implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Component state
  isLoading = true;
  favorites: FavoriteItem[] = [];
  filteredFavorites: FavoriteItem[] = [];

  // Filters
  activeFilter: FavoriteType = FavoriteType.ALL;
  searchTerm = '';

  // Enums for template
  FavoriteType = FavoriteType;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads user's favorite items from the backend
   */
  loadFavorites(): void {
    this.isLoading = true;

    this.favoritesService.getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (favorites) => {
          this.favorites = favorites;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading favorites:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Applies current filters to the favorites list
   */
  applyFilters(): void {
    let filtered = [...this.favorites];

    // Filter by type
    if (this.activeFilter !== FavoriteType.ALL) {
      filtered = filtered.filter(item => item.type === this.activeFilter);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        (item.businessName && item.businessName.toLowerCase().includes(searchLower))
      );
    }

    this.filteredFavorites = filtered;
  }

  /**
   * Sets the active filter and applies filters
   */
  setFilter(filter: FavoriteType): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  /**
   * Handles search input changes
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Removes an item from favorites
   */
  removeFavorite(favoriteId: string): void {
    this.favoritesService.removeFromFavorites(favoriteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.favorites = this.favorites.filter(item => item.id !== favoriteId);
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error removing favorite:', error);
        }
      });
  }

  /**
   * Navigates to the detailed view of a favorite item
   */
  navigateToItem(item: FavoriteItem): void {
    // TODO: Implement navigation based on item type
    console.log('Navigate to:', item);
  }

  /**
   * Gets the count of favorites by type
   */
  getFavoriteCount(type: FavoriteType): number {
    if (type === FavoriteType.ALL) {
      return this.favorites.length;
    }
    return this.favorites.filter(item => item.type === type).length;
  }

  /**
   * Gets the appropriate route for an item based on its type
   */
  getItemRoute(item: FavoriteItem): string {
    switch (item.type) {
      case 'offer':
        return `/deals/${item.slug || item.id}`;
      case 'product':
        return `/products/${item.slug || item.id}`;
      case 'business':
        return `/business/${item.slug || item.id}`;
      default:
        return '/';
    }
  }

  /**
   * Gets the label for filter buttons
   */
  getFilterLabel(filter: FavoriteType): string {
    switch (filter) {
      case FavoriteType.ALL:
        return 'Todos';
      case FavoriteType.OFFERS:
        return 'Ofertas';
      case FavoriteType.PRODUCTS:
        return 'Productos';
      case FavoriteType.BUSINESSES:
        return 'Negocios';
      default:
        return '';
    }
  }

  /**
   * Gets the label for item types
   */
  getTypeLabel(type: string): string {
    switch (type) {
      case 'offer':
        return 'Oferta';
      case 'product':
        return 'Producto';
      case 'business':
        return 'Negocio';
      default:
        return '';
    }
  }

  /**
   * Gets CSS classes for type badges
   */
  getTypeBadgeClass(type: string): string {
    const baseClasses = 'tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full';
    switch (type) {
      case 'offer':
        return `${baseClasses} tw-bg-coral-100 tw-text-coral-800`;
      case 'product':
        return `${baseClasses} tw-bg-blue-100 tw-text-blue-800`;
      case 'business':
        return `${baseClasses} tw-bg-emerald-green-100 tw-text-emerald-green-800`;
      default:
        return `${baseClasses} tw-bg-gray-100 tw-text-gray-800`;
    }
  }

  /**
   * Handles image load errors by hiding the broken image
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}
