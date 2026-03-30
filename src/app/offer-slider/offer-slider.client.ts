import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Offer } from '@app/shared/models/offer.model';
import { BreakpointService, CustomBreakpoints } from '@core/services/breakpoint.service';

@Injectable({ providedIn: 'root' })
export class OfferSliderClient {
  private readonly http = inject(HttpClient);
  private readonly breakpointService = inject(BreakpointService);
  private readonly offersSubject = new BehaviorSubject<Offer[]>([]);
  offers$ = this.offersSubject.asObservable();

  isMobile$ = this.breakpointService.observe([CustomBreakpoints.Handset])
    .pipe(map(result => result.matches));

  loadOffers() {
    this.http.get<{ offers: Offer[] }>('/assets/mocks/offers.json')
      .subscribe(response => this.offersSubject.next(response.offers));
  }
}
