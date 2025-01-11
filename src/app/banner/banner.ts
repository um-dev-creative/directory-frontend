import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
interface BannerData {
  banner: {
    title: string;
    categories: Array<{
      name: string;
      image: string;
    }>;
  };
}

@Component({
  selector: 'app-banner',
  templateUrl: './banner.html',
  styleUrls: ['./banner.css'],
  imports: [CommonModule]
})
export class Banner implements OnInit {
  bannerData: BannerData = {
    banner: {
      title: '',
      categories: []
    }
  };

  constructor(private http: HttpClient) {}

  get title(): string {
    return this.bannerData?.banner?.title || '';
  }
  get categories(): Array<{ name: string; image: string }> {
    return this.bannerData?.banner?.categories || [];
  }

  ngOnInit() {
    this.http.get<BannerData>('assets/data/banner.json')
      .subscribe({
        next: (data) => {
          this.bannerData = data;
        },
        error: (error) => {
          console.error('Error loading banner data:', error);
        }
      });
  }
}
