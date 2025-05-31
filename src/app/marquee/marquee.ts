import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MarqueeImage {
  id: number;
  src: string;
  alt: string;
  link: string;
}

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
})
export class Marquee implements OnInit {
  images: MarqueeImage[] = [];
  duplicatedImages: MarqueeImage[] = [];
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {}

  ngOnInit(): void {
    this.http.get<MarqueeImage[]>('/assets/mocks/marquee-images.json').subscribe((data) => {
      this.images = data;
      this.duplicatedImages = [...this.images, ...this.images];

      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.style.setProperty('--number-of-items', this.images.length.toString());
      }
    });
  }
}
