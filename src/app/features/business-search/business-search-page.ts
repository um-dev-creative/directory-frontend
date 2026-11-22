import {Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal, ChangeDetectionStrategy} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ActivatedRoute, ParamMap, Router, RouterLink} from '@angular/router';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {TranslateModule} from '@ngx-translate/core';
import {Search} from '@app/features/search/search';
import {BusinessSearchStoreService} from '@core/store/business-search/business-search-store.service';
import {CategoryClient} from '@core/services/category/category.client';
import {LoggerService} from '@core/services/logger.service';
import {BusinessSearchParams, CategoryOption} from '@shared/models/location.model';

/** Results per page of the search page; the backend accepts 1 to 100. */
export const SEARCH_PAGE_SIZE = 10;

/**
 * Reads the search filters from the query string (`city_id`, `category_id`, `q`, `page`). The URL is the source of truth, so a search
 * can be shared, reloaded and reached with the back button.
 */
export function paramsFromQuery(query: ParamMap): BusinessSearchParams {
  const page = Number.parseInt(query.get('page') ?? '', 10);
  return {
    cityId: query.get('city_id') || null,
    category: query.get('category_id') || null,
    q: query.get('q')?.trim() || null,
    page: Number.isFinite(page) && page >= 1 ? page : 1,
    perPage: SEARCH_PAGE_SIZE
  };
}

/** Search of businesses by city, category and text (route `/search`). */
@Component({
  selector: 'app-business-search-page',
  standalone: true,
  imports: [TranslateModule, RouterLink, Search],
  templateUrl: './business-search-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './business-search-page.css'
})
export class BusinessSearchPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchStore = inject(BusinessSearchStoreService);
  private readonly categoryClient = inject(CategoryClient);
  private readonly logger = inject(LoggerService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly results = toSignal(this.searchStore.results$, {initialValue: []});
  protected readonly totalCount = toSignal(this.searchStore.totalCount$, {initialValue: 0});
  protected readonly page = toSignal(this.searchStore.page$, {initialValue: 1});
  protected readonly totalPages = toSignal(this.searchStore.totalPages$, {initialValue: 0});
  protected readonly isSearching = toSignal(this.searchStore.isSearching$, {initialValue: false});
  protected readonly error = toSignal(this.searchStore.error$, {initialValue: null});
  protected readonly isEmpty = toSignal(this.searchStore.isEmpty$, {initialValue: false});
  protected readonly hasPreviousPage = toSignal(this.searchStore.hasPreviousPage$, {initialValue: false});
  protected readonly hasNextPage = toSignal(this.searchStore.hasNextPage$, {initialValue: false});
  protected readonly cities = toSignal(this.searchStore.cities$, {initialValue: []});

  protected readonly categories = signal<CategoryOption[]>([]);
  protected readonly filters = signal<BusinessSearchParams>({});

  ngOnInit(): void {
    // SSR: browser-only. The search goes through the BFF with the browser's session, so the server renders the page without results
    // and the browser runs the search after hydration.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.searchStore.loadCities();
    this.loadCategories();
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((query) => {
      const params = paramsFromQuery(query);
      this.filters.set(params);
      this.searchStore.search(params);
    });
  }

  protected onCityChange(event: Event): void {
    this.navigate({city_id: (event.target as HTMLSelectElement).value || null, page: null});
  }

  protected onCategoryChange(event: Event): void {
    this.navigate({category_id: (event.target as HTMLSelectElement).value || null, page: null});
  }

  protected onTextSubmit(text: string): void {
    this.navigate({q: text || null, page: null});
  }

  protected onTextClear(): void {
    if (this.filters().q) {
      this.navigate({q: null, page: null});
    }
  }

  protected goToPage(page: number): void {
    this.navigate({page: page > 1 ? page : null});
  }

  /** Merges the changes into the query string; `null` removes a parameter. */
  private navigate(changes: Record<string, string | number | null>): void {
    void this.router.navigate([], {relativeTo: this.route, queryParams: changes, queryParamsHandling: 'merge'});
  }

  private loadCategories(): void {
    this.categoryClient.getCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const data: { id: string; name: string }[] = response?.headers?.status === 200 && Array.isArray(response.data) ? response.data : [];
        this.categories.set(data.map(({id, name}) => ({id, name})).sort((a, b) => a.name.localeCompare(b.name)));
      },
      error: (err) => this.logger.error('BusinessSearchPage: categories could not be loaded', err)
    });
  }
}
