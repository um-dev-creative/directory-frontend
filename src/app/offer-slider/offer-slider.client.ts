import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Offer } from '@app/shared/models/offer.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class OfferSliderClient {
  private readonly offersSubject = new BehaviorSubject<Offer[]>([]);
  offers$ = this.offersSubject.asObservable();

  isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

  constructor(private readonly http: HttpClient, private readonly breakpointObserver: BreakpointObserver) {}

  loadOffers() {
    this.http.get<{ offers: Offer[] }>('/assets/mocks/offers.json')
      .subscribe(response => this.offersSubject.next(response.offers));
  }
}
