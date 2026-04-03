import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Button } from '@app/components/ui';
import { LandingStoreService } from '@app/core/store/landing/landing-store.service';

interface Product {
  id: string;
  name: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit, OnDestroy {
  products: Product[] = [];

  private readonly landingStore = inject(LandingStoreService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.landingStore.featuredProducts$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.products = items.map(p => ({
        id: p.id,
        name: p.name,
        image: p.imageUrl,
        alt: p.altText
      }));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
