import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Button, SkeletonComponent } from '@app/components/ui';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';
import {environment} from '@env/environment';

interface Product {
  id: string;
  name: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, SkeletonComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit, OnDestroy {
  products: Product[] = [];
  readonly imageErrors = signal<Set<string>>(new Set());
  readonly loading$ = inject(LandingStoreService).isLoading$;

  private readonly landingStore = inject(LandingStoreService);
  private readonly destroy$ = new Subject<void>();
  private readonly imageBucketUrl = environment.appImgBaseHref || ''; // Ensure apiUrl is set correctly


  ngOnInit(): void {
    this.landingStore.featuredProducts$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.products = items.map(p => ({
        id: p.id,
        name: p.name,
        image: p.imageUrl.startsWith('http://') || p.imageUrl.startsWith('https://') ? p.imageUrl : `${this.imageBucketUrl}${p.imageUrl}`,
        alt: p.altText
      }));
    });
  }

  onImageError(productId: string): void {
    this.imageErrors.update(s => new Set(s).add(productId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
