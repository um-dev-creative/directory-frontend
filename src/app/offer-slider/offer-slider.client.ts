import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Offer } from '@app/models/offer.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class OfferSliderClient {
  private offersSubject = new BehaviorSubject<Offer[]>([]);
  offers$ = this.offersSubject.asObservable();

  isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

  constructor(private http: HttpClient, private breakpointObserver: BreakpointObserver) {}

  loadOffers() {
    this.http.get<{ offers: Offer[] }>('/assets/data/offers.json')
      .subscribe(response => this.offersSubject.next(response.offers));
  }
}
