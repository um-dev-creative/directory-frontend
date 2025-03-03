import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Category {
  name: string;
  image: string;
}
interface BannerImage {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
}
interface BannerData {
  title: string;
  categories: Category[];
  banners: {
    top?: BannerImage;
    mid?: BannerImage;
  };
}
@Component({
  selector: 'app-banner',
  templateUrl: './banner.html',
  styleUrls: ['./banner.css'],
  imports: [CommonModule, RouterModule]
})
export class Banner implements OnInit {
  @Input() bannerType?: 'top' | 'mid';

  bannerData: BannerData = {
    title: '',
    categories: [] as Category[],
    banners: {},
  };
  constructor(private http: HttpClient) {}

  get title(): string {
    return this.bannerData?.title || '';
  }

  get categories(): Category[] {
    return this.bannerData?.categories || [];
  }

  get currentBanner(): BannerImage | null {
    if (!this.bannerType || !this.bannerData?.banners) return null;
    return this.bannerData.banners[this.bannerType] || null;
  }

  ngOnInit() {
    this.http.get<{ banner: BannerData }>('assets/data/banner.json')
      .subscribe({
        next: (data) => {
          this.bannerData = data.banner;
        },
        error: (error) => {
          console.error('Error loading banner data:', error);
        },
      });
  }
}
