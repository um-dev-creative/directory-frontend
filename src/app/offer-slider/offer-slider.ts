import {
  Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Renderer2, Input, Inject, PLATFORM_ID,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { OfferSliderClient } from '@app/offer-slider/offer-slider.client';
import { Observable } from 'rxjs';
import { Offer } from '@app/shared/models/offer.model';
import { BadgeComponent, IconComponent } from '@app/components/ui';
import { LoggerService } from '@app/core/services/logger.service';

@Component({
  selector: 'app-offer-slider',
  imports: [
    CommonModule,
    BadgeComponent,
    IconComponent
  ],
  templateUrl: './offer-slider.html',
  styleUrls: ['./offer-slider.css']
})
export class OfferSlider implements OnInit, AfterViewInit, OnDestroy {
  @Input() offers: Offer[] | null = null;
  @Input() sliderTitle: string = 'Los mas reclamados';
  offers$: Observable<Offer[]>;
  isMobile$: Observable<boolean>;

  @ViewChild('offerContainer', { static: false }) offerContainer!: ElementRef;

  private readonly events: (() => void)[] = []; // Para eliminar eventos dinámicos
  private isDragging = false;
  private startX = 0;
  private scrollStartPosition = 0;
  private readonly logger = inject(LoggerService);

  constructor(
    private readonly offerSliderClient: OfferSliderClient,
    private readonly renderer: Renderer2,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.offers$ = this.offerSliderClient.offers$;
    this.isMobile$ = this.offerSliderClient.isMobile$;
  }

  ngOnInit() {
    if (!this.offers) {
      this.offerSliderClient.loadOffers();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScroll();
    }
  }

  scrollLeft() {
    this.offerContainer?.nativeElement?.scrollBy({ left: -220, behavior: 'smooth' });
  }

  scrollRight() {
    this.offerContainer?.nativeElement?.scrollBy({ left: 220, behavior: 'smooth' });
  }

  onOfferClick(offer: Offer): void {
    if (!offer) {
      this.logger.warn('No offer provided to onOfferClick');
      return;
    }

    // Si la oferta tiene un link interno, navegamos a él
    if (offer.internalLink) {
      if (offer.internalLink.startsWith('http')) {
        // Es un link externo
        if (isPlatformBrowser(this.platformId)) {
          window.open(offer.internalLink, '_blank', 'noopener,noreferrer');
        }
      } else {
        // Es un link interno de la aplicación
        this.router.navigateByUrl(offer.internalLink);
      }
    } else {
      // Si no hay link, por lo menos logueamos la oferta
      this.logger.info('Offer clicked', offer);
      // Aquí podrías agregar navegación por defecto, como ir a una página de detalles
      // this.router.navigate(['/offers', offer.id]);
    }
  }

  private setupScroll() {
    const container = this.offerContainer?.nativeElement;
    if (!container) return; // Handle when offerContainer doesn't exist (e.g., in mobile view)
    container.classList.add('offer-container'); // Aplica CSS para ocultar la barra de scroll

    const mouseDown = this.renderer.listen(container, 'mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      this.startX = e.pageX - container.offsetLeft;
      this.scrollStartPosition = container.scrollLeft;
    });

    const mouseLeave = this.renderer.listen(container, 'mouseleave', () => this.isDragging = false);
    const mouseUp = this.renderer.listen(container, 'mouseup', () => this.isDragging = false);

    const mouseMove = this.renderer.listen(container, 'mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - this.startX) * 2;
      container.scrollLeft = this.scrollStartPosition - walk;
    });

    const touchStart = this.renderer.listen(container, 'touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].pageX;
      this.scrollStartPosition = container.scrollLeft;
    });

    const touchMove = this.renderer.listen(container, 'touchmove', (e: TouchEvent) => {
      const touchX = e.touches[0].pageX;
      const moveX = touchX - this.startX;
      container.scrollLeft = this.scrollStartPosition - moveX;
    });

    this.events.push(mouseDown, mouseLeave, mouseUp, mouseMove, touchStart, touchMove);
  }

  ngOnDestroy() {
    this.events.forEach(unsub => unsub());
  }
}
