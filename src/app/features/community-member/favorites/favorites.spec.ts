import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Favorites } from './favorites';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Favorites,
        RouterTestingModule,
        FormsModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorites on init', () => {
    component.ngOnInit();
    expect(component.isLoading).toBeTruthy();
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
    
    component.setFilter('offer' as any);
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

  it('should remove favorite item', () => {
    component.favorites = [
      {
        id: '1',
        type: 'offer',
        title: 'Test Offer',
        description: 'Test Description',
        dateAdded: new Date()
      }
    ];
    
    component.removeFavorite('1');
    expect(component.favorites.length).toBe(0);
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
    
    expect(component.getFavoriteCount('all' as any)).toBe(2);
    expect(component.getFavoriteCount('offer' as any)).toBe(1);
    expect(component.getFavoriteCount('product' as any)).toBe(1);
  });
});
