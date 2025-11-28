import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Button } from "@app/components/ui";
import { LoggerService } from '@app/core/services/logger.service';

interface Trend {
  title: string;
  description: string;
  image: string;
  brandLogo: string;
  internalLink: string;
}

@Component({
  selector: 'app-trend-carousel',
  imports: [Button],
  templateUrl: './trend-carousel.html',
  styleUrl: './trend-carousel.css'
})

export class TrendCarousel implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  private scrollInterval: any;
  private readonly scrollSpeed = 200;  // Ajusta este valor para controlar la velocidad
  private readonly logger = inject(LoggerService);

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

  private readonly router: Router = inject(Router);

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Trend[]>('/assets/mocks/offers-list.json').subscribe(data => {
      this.trends = data;
    });
  }

  navigateToDeals(): void {
    this.router.navigate(['/deals']);
  }

  /** Maneja el clic en una tarjeta del carrusel */
  onCardClick(trend: Trend): void {
    if (trend.internalLink) {
      // Navegar a la ruta interna especificada en el trend
      this.router.navigate([trend.internalLink]);
    } else {
      // Fallback: navegar a una página de detalle con el título como parámetro
      this.logger.warn('No internal link provided for trend:', trend.title);
      // Opcional: podrías navegar a una página de detalle genérica
      // this.router.navigate(['/trend-detail'], { queryParams: { title: trend.title } });
    }
  }
}
