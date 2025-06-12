import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, shareReplay } from 'rxjs/operators';

export interface Category {
  name: string;
  image: string;
}

export interface BannerImage {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
  route?: string;
}

export interface BannerData {
  title: string;
  categories: Category[];
  banners: {
    top?: BannerImage;
    mid?: BannerImage;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private readonly apiUrl = 'assets/mocks/banner.json';
  private cache$ = new Map<string, Observable<BannerData>>();

  constructor(private readonly http: HttpClient) {}

  getBannerData(): Observable<BannerData> {
    if (this.cache$.has(this.apiUrl)) {
      return this.cache$.get(this.apiUrl)!;
    }

    const bannerData$ = this.http.get<{ banner: BannerData }>(this.apiUrl)
      .pipe(
        retry(2),
        map(response => response.banner),
        shareReplay(1),
        catchError(this.handleError)
      );

    this.cache$.set(this.apiUrl, bannerData$);
    return bannerData$;
  }

  clearCache(): void {
    this.cache$.clear();
  }

  private handleError(error: any): Observable<never> {
    console.error('Banner loading error:', error);

    let errorMessage = 'Failed to load banner data';

    if (error.status === 0) {
      errorMessage = 'Network error - please check your connection';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = 'Banner data not found';
    } else if (error.status >= 500) {
      errorMessage = 'Server error - please try again later';
    }

    return throwError(() => new Error(errorMessage));
  }
}
