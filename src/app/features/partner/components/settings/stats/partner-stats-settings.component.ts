import {Component, effect, inject, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {SessionState} from '@app/core/store/session/session.state';
import {BusinessStatsStoreService} from '@core/store/business-stats/business-stats-store.service';
import {DailyViews, STATS_DEFAULT_WINDOW, STATS_WINDOWS} from '@shared/models/business-stats.model';

/**
 * Views of the business of the signed-in owner: total, today, last 7 days and a bar per day of the chosen window.
 * Only counts are shown: the backend stores no information about the visitors.
 */
@Component({
  selector: 'app-partner-stats-settings',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './partner-stats-settings.component.html',
  styleUrl: './partner-stats-settings.component.css'
})
export class PartnerStatsSettingsComponent {
  private readonly router = inject(Router);
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly statsStore = inject(BusinessStatsStoreService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly windows = STATS_WINDOWS;
  /** The business the owner manages: the first one of the session. */
  protected readonly businessId = toSignal(
    this.store.select((state) => state.session?.sessionData?.userAuth?.businesses?.[0] ?? null), {initialValue: null});
  protected readonly stats = toSignal(this.statsStore.stats$, {initialValue: null});
  protected readonly isLoading = toSignal(this.statsStore.isLoading$, {initialValue: false});
  protected readonly error = toSignal(this.statsStore.error$, {initialValue: null});
  protected readonly maxDailyViews = toSignal(this.statsStore.maxDailyViews$, {initialValue: 1});
  protected readonly days = signal(STATS_DEFAULT_WINDOW);

  constructor() {
    // SSR: browser-only. The statistics are read through the BFF with the browser's session.
    effect(() => {
      const businessId = this.businessId();
      if (businessId && isPlatformBrowser(this.platformId)) {
        this.statsStore.load(businessId, this.days());
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/partner/settings']);
  }

  protected selectWindow(days: number): void {
    this.days.set(days);
  }

  /** Height of a bar, in percent of the highest day of the window (a day with views is never invisible). */
  protected barHeight(day: DailyViews): number {
    if (day.views <= 0) {
      return 0;
    }
    return Math.max(4, Math.round((day.views / this.maxDailyViews()) * 100));
  }
}
