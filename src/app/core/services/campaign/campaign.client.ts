import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DFC, SESSION_TOKEN_BACKEND} from '@app/shared/constants/app.const';
import {catchError, map, Observable, throwError, switchMap, take, shareReplay} from 'rxjs';
import {CampaignCreateRequest, CampaignCreateResponse} from '@shared/models/campaign.model';
import {ServiceTemplate} from '@app/core/services/service-template';
import {SessionStoreService} from '@app/core/store/session/session-store.service';

export type Campaign = {
  id: string;
  title: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  categoryId?: string;
  businessId?: string;
  active?: boolean;
  categoryName?: string;
  discount?: number;
  status?: string;
  terms?: string;
};

export interface PaginatedCampaigns {
  items: Campaign[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Service client for handling operations related to campaigns, including creation and retrieval of campaigns.
 * This service interacts with the backend API and manages in-memory caching for optimized requests.
 */
@Injectable({
  providedIn: 'root'
})
export class CampaignClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly sessionStore = inject(SessionStoreService);
  private readonly CAMPAIGN_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL + DFC.RelativePath.GENERAL_PATH + '/campaigns';

  // Simple in-memory cache for observables keyed by `${page}|${limit}`
  private readonly cache = new Map<string, Observable<PaginatedCampaigns>>();

  constructor() {
    super();
  }

  /**
   * PATCH update an existing campaign by id.
   * Accepts a partial campaign payload (matching backend expectations) and returns normalized response.
   * Expected successful response example: { id: string, lastUpdate: string } with HTTP 202.
   */
  patchCampaign(id: string, requestBody: any): Observable<{status: number; body: {id: string; lastUpdate: string}}>{
    this.logInfo('CampaignClient.patchCampaign -> PATCH ' + this.CAMPAIGN_PATH + '/' + id, requestBody);

    return this.sessionStore.session$.pipe(
      take(1),
      switchMap(session => {
        let sessionTokenBkd: string | undefined = session?.userAuth?.sessionTokenBkd;
        let headers: HttpHeaders = DFC.HttpHeader.STANDARD;
        if (sessionTokenBkd) {
          headers = headers.set(SESSION_TOKEN_BACKEND, sessionTokenBkd);
        }

        // perform PATCH to /campaigns/:id
        return this.httpClient.patch<{id: string; lastUpdate: string}>(`${this.CAMPAIGN_PATH}/${id}`, requestBody, {
          headers,
          observe: 'response' as const
        });
      }),
      map(response => ({status: (response as any).status, body: (response as any).body})),
      catchError((err) => {
        const payload = err?.error ?? null;
        const normalized = {
          status: err?.status ?? 0,
          message: payload?.message ?? err?.message ?? 'Unknown error',
          errors: payload?.errors ?? payload
        };
        this.logError('CampaignClient.patchCampaign error', normalized);
        return throwError(() => normalized);
      })
    );
  }

  /**
   * Creates a new campaign by sending a POST request to the campaign endpoint with the provided request data.
   *
   * @param {CampaignCreateRequest} request - The details of the campaign to be created, including necessary parameters and configurations.
   * @return {Observable<any>} An observable that emits the status and body of the response when the campaign is successfully created, or an error object if the request fails.
   */
  create(request: CampaignCreateRequest): Observable<any> {
    this.logInfo('CampaignClient.create -> POST ' + this.CAMPAIGN_PATH, request);

    return this.sessionStore.session$.pipe(
      take(1),
      switchMap(session => {
        let sessionTokenBkd: string | undefined = session?.userAuth?.sessionTokenBkd;
        let headers: HttpHeaders = DFC.HttpHeader.STANDARD;
        if (sessionTokenBkd) {
          headers = headers.set(SESSION_TOKEN_BACKEND, sessionTokenBkd);
        }
        this.clearCache();
        return this.httpClient.post<CampaignCreateResponse>(this.CAMPAIGN_PATH, request, {
          headers,
          observe: 'response' as const
        });
      }),
      map(response => ({status: (response as any).status, body: (response as any).body})),
      catchError((err) => {
        const payload = err?.error ?? null;
        const normalized = {
          status: err?.status ?? 0,
          message: payload?.message ?? err?.message ?? 'Unknown error',
          errors: payload?.errors ?? payload
        };
        this.logError('CampaignClient.create error', normalized);
        return throwError(() => normalized);
      })
    );
  }

  /**
   * Fetches a paginated list of campaigns from the backend.
   * Results can be customized using optional pagination parameters.
   * The method utilizes cache for repeated requests with the same parameters.
   *
   * @param params An object containing optional pagination values:
   * - page: The page number to retrieve. Defaults to 1 if not provided.
   * - limit: The number of items per page. Defaults to 10 if not provided.
   * @return An observable emitting the paginated campaigns data, including items, total count, page, per page, and total pages.
   */
  list(params: { page?: number; limit?: number } = {}): Observable<PaginatedCampaigns> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const cacheKey = `${page}|${limit}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as Observable<PaginatedCampaigns>;
    }

    const obs = this.sessionStore.session$.pipe(
      take(1),
      switchMap(session => {
        let sessionTokenBkd: string | undefined = session?.userAuth?.sessionTokenBkd;
        let headers: HttpHeaders = DFC.HttpHeader.STANDARD;
        if (sessionTokenBkd) {
          headers = headers.set(SESSION_TOKEN_BACKEND, sessionTokenBkd);
        }

        let httpParams = new HttpParams();
        httpParams = httpParams.set('page', String(page));
        httpParams = httpParams.set('per_page', String(limit));

        return this.httpClient.get<any>(this.CAMPAIGN_PATH, {headers, params: httpParams});
      }),
      map((response: any) => {
        // Normalize backend response to PaginatedCampaigns
        // Backend may return: { data: [...], total, page, limit, totalPages }
        const dataArray = response?.data ?? response?.items ?? response ?? [];
        const items: Campaign[] = (Array.isArray(dataArray.items) ? dataArray.items : []).map((dto: any) => ({
          id: String(dto.id ?? dto.id ?? dto.uuid ?? ''),
          title: dto.title ?? dto.title ?? '',
          description: dto.description ?? dto.summary ?? dto.desc ?? '',
          categoryId: dto.categoryId ?? dto.category ?? null,
          categoryName: dto.categoryName ?? dto.category ?? null,
          startDate: dto.startDate ?? dto.validFrom ?? null,
          endDate: dto.endDate ?? dto.validUntil ?? null,
          discount: dto.discount ?? dto.discount ?? 0,
          status: dto.status ?? dto.state ?? null,
          terms: dto.terms ?? dto.terms ?? null,
        }));

        const total = Number(response?.data.total_count ?? response?.totalItems ?? items.length);
        const respPage = Number(response?.data.page ?? page);
        const respLimit = Number(response?.data.per_page ?? limit);
        const totalPages = Number(response?.data.total_pages ?? Math.ceil(total / (respLimit || 1)));
        return {
          items,
          total_count: total,
          page: respPage,
          per_page: respLimit,
          total_pages: totalPages
        } as PaginatedCampaigns;
      }),
      catchError((err) => {
        const payload = err?.error ?? null;
        const normalized = {
          status: err?.status ?? 0,
          message: payload?.message ?? err?.message ?? 'Error fetching campaigns',
          errors: payload?.errors ?? payload
        };
        this.logError('CampaignClient.list error', normalized);
        // Surface friendly message to callers
        return throwError(() => normalized);
      }),
      // shareReplay so concurrent subscribers share the same request and cached value
      shareReplay(1)
    );

    // store in cache
    this.cache.set(cacheKey, obs);

    return obs;
  }

  /**
   * Clears all stored data in the cache.
   *
   * @return {void} Does not return any value.
   */
  clearCache(): void {
    this.cache.clear();
  }
}
