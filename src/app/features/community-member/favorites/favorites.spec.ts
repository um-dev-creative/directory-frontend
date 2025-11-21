/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Favorites, FavoriteType, FavoriteItem } from './favorites';
import { FavoritesService } from './services';
import {provideLocationMocks} from '@angular/common/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FavoritesService', ['getFavorites', 'removeFromFavorites']);

    await TestBed.configureTestingModule({
      imports: [
        Favorites,
        FormsModule
      ],
      providers: [
        { provide: FavoritesService, useValue: spy },
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        provideHttpClientTesting(),
        provideLocationMocks(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;

    // Setup default spy returns
    favoritesService.getFavorites.and.returnValue(of([]));
    favoritesService.removeFromFavorites.and.returnValue(of(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorites on init', () => {
    const mockFavorites: FavoriteItem[] = [
      {
        id: '1',
        type: 'offer',
        title: 'Test Offer',
        description: 'Test Description',
        dateAdded: new Date()
      }
    ];

    favoritesService.getFavorites.and.returnValue(of(mockFavorites));
    component.ngOnInit();
    expect(favoritesService.getFavorites).toHaveBeenCalled();
  });

  it('should filter favorites by type', () => {
    component.favorites = [
      {
        id: '1',
        type: 'offer',
        title: 'Test Offer',
        description: 'Test Description',
        dateAdded: new Date()
      },
      {
        id: '2',
        type: 'product',
        title: 'Test Product',
        description: 'Test Description',
        dateAdded: new Date()
      }
    ];

    component.setFilter(FavoriteType.OFFERS);
    expect(component.filteredFavorites.length).toBe(1);
    expect(component.filteredFavorites[0].type).toBe('offer');
  });

  it('should search favorites by title', () => {
    component.favorites = [
      {
        id: '1',
        type: 'offer',
        title: 'Pizza Offer',
        description: 'Test Description',
        dateAdded: new Date()
      },
      {
        id: '2',
        type: 'product',
        title: 'Coffee Product',
        description: 'Test Description',
        dateAdded: new Date()
      }
    ];

    component.searchTerm = 'pizza';
    component.onSearchChange();
    expect(component.filteredFavorites.length).toBe(1);
    expect(component.filteredFavorites[0].title.toLowerCase()).toContain('pizza');
  });

  it('should remove favorite item via service', () => {
    component.favorites = [
      {
        id: '1',
        type: 'offer',
        title: 'Test Offer',
        description: 'Test Description',
        dateAdded: new Date()
      }
    ];

    favoritesService.removeFromFavorites.and.returnValue(of(true));
    component.removeFavorite('1');
    expect(favoritesService.removeFromFavorites).toHaveBeenCalledWith('1');
  });

  it('should get correct favorite count', () => {
    component.favorites = [
      {
        id: '1',
        type: 'offer',
        title: 'Test Offer',
        description: 'Test Description',
        dateAdded: new Date()
      },
      {
        id: '2',
        type: 'product',
        title: 'Test Product',
        description: 'Test Description',
        dateAdded: new Date()
      }
    ];

    expect(component.getFavoriteCount(FavoriteType.ALL)).toBe(2);
    expect(component.getFavoriteCount(FavoriteType.OFFERS)).toBe(1);
    expect(component.getFavoriteCount(FavoriteType.PRODUCTS)).toBe(1);
  });
});
