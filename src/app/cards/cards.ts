import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Image {
  src: string;
  alt: string;
}

interface CardsData {
  images: Image[];
}

@Component({
  selector: 'app-cards',
  imports: [
    CommonModule,
  ],
  templateUrl: './cards.html',
  styleUrls: ['./cards.css']
})
export class Cards implements OnInit {
  cardsData: Image[] = [];

  constructor(private readonly http: HttpClient) {}

  get cards(): Image[] {
    return this.cardsData;
  }

  ngOnInit(): void {
    this.http.get<CardsData>('assets/mocks/images.json')
      .subscribe({
        next: (data) => {
          this.cardsData = data.images;
        },
        error: (error) => {
          console.error('Error loading banner data:', error);
        }
      });
  }
}
