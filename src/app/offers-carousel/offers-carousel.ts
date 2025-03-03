import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Offer {
  title: string;
  description: string;
  image: string;
  brandLogo: string;
}

@Component({
  selector: 'app-offers-carousel',
  imports: [],
  templateUrl: './offers-carousel.html',
  styleUrl: './offers-carousel.css'
})

export class OffersCarousel implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  private scrollInterval: any;
  private scrollSpeed = 200;  // Ajusta este valor para controlar la velocidad

  /** Inicia el desplazamiento automático */
  startScroll(direction: 'left' | 'right') {
    this.stopScroll();  // Asegura que no haya otro intervalo corriendo
    this.scrollInterval = setInterval(() => {
      const scrollAmount = direction === 'left' ? -this.scrollSpeed : this.scrollSpeed;
      this.carousel.nativeElement.scrollBy({ left: scrollAmount, behavior: 'auto' });
    }, 100); // Ajusta este valor para hacer el movimiento más rápido o lento
  }

  /** Detiene el desplazamiento */
  stopScroll() {
    clearInterval(this.scrollInterval);
  }
  offers: Offer[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Offer[]>('/assets/data/offers-list.json').subscribe(data => {
      this.offers = data;
    });
  }
}
