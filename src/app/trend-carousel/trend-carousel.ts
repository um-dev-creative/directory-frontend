import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Trend {
  title: string;
  description: string;
  image: string;
  brandLogo: string;
}

@Component({
  selector: 'app-trend-carousel',
  imports: [],
  templateUrl: './trend-carousel.html',
  styleUrl: './trend-carousel.css'
})

export class TrendCarousel implements OnInit {
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
  trends: Trend[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Trend[]>('/assets/mocks/offers-list.json').subscribe(data => {
      this.trends = data;
    });
  }
}
