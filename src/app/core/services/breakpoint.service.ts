import { Injectable, inject, PLATFORM_ID, OnDestroy, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';

export interface BreakpointState {
  matches: boolean;
  breakpoints: Record<string, boolean>;
}

export const CustomBreakpoints = {
  Handset: '(max-width: 599.98px)',
  Tablet: '(min-width: 600px) and (max-width: 959.98px)',
  Web: '(min-width: 960px)',
  XSmall: '(max-width: 599.98px)',
  Small: '(min-width: 600px) and (max-width: 959.98px)',
} as const;

@Injectable({ providedIn: 'root' })
export class BreakpointService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly mediaQueryLists = new Map<string, MediaQueryList>();
  private readonly cleanupFns: (() => void)[] = [];

  // SSR: browser-only
  observe(queries: string[]): Observable<BreakpointState> {
    if (!isPlatformBrowser(this.platformId)) {
      return of({
        matches: false,
        breakpoints: queries.reduce((acc, q) => ({ ...acc, [q]: false }), {} as Record<string, boolean>)
      });
    }

    const observables = queries.map(query => this.observeQuery(query));

    return combineLatest(observables).pipe(
      map(results => {
        const breakpoints: Record<string, boolean> = {};
        queries.forEach((query, i) => {
          breakpoints[query] = results[i];
        });
        return {
          matches: results.some(m => m),
          breakpoints
        };
      }),
      distinctUntilChanged((a, b) => a.matches === b.matches && JSON.stringify(a.breakpoints) === JSON.stringify(b.breakpoints)),
      shareReplay(1)
    );
  }

  private observeQuery(query: string): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      const mql = this.getMediaQueryList(query);
      const handler = (event: MediaQueryListEvent) => {
        this.ngZone.run(() => subscriber.next(event.matches));
      };

      mql.addEventListener('change', handler);
      this.cleanupFns.push(() => mql.removeEventListener('change', handler));

      subscriber.next(mql.matches);
    }).pipe(
      distinctUntilChanged(),
      startWith(this.getMediaQueryList(query).matches)
    );
  }

  private getMediaQueryList(query: string): MediaQueryList {
    if (!this.mediaQueryLists.has(query)) {
      this.mediaQueryLists.set(query, window.matchMedia(query));
    }
    return this.mediaQueryLists.get(query)!;
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns.length = 0;
    this.mediaQueryLists.clear();
  }
}
