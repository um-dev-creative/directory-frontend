import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '@env/environment';
interface DownloadButton {
  platform: string;
  image: string;
  url: string;
}

interface Promotion {
  title: string;
  image: string;
  url: string;
}

interface PromoSectionData {
  download_buttons: DownloadButton[];
  promotions: Promotion[];
}
@Component({
  selector: 'app-promo-section',
  imports: [],
  templateUrl: './promo-section.html',
  styleUrl: './promo-section.css'
})
export class PromoSection implements OnInit {
  promo: PromoSectionData | null = null;
  imageBucketUrl = environment.appImgBaseHref || ''; // Ensure apiUrl is set correctly

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadPromoData();
  }

  private loadPromoData(): void {
    this.http.get<PromoSectionData>('/assets/mocks/promo-section.json').subscribe({
      next: (data) => (this.promo = data),
      error: (err) => console.error('Error loading promo data', err),
    });
  }
}
