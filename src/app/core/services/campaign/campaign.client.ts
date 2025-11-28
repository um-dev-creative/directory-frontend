import {inject, Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {DFC, SESSION_TOKEN_BACKEND} from '@app/shared/constants/app.const';
import {catchError, map, Observable, throwError, switchMap, take, shareReplay} from 'rxjs';
import {
  Campaign,
  CampaignCreateRequest,
  CampaignCreateResponse,
  PaginatedCampaigns
} from '@shared/models/campaign.model';
import {ClientTemplate} from '@core/services/client-template';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {CampaignMapper} from '@core/services';
import {sanitizeError} from '@shared/handler/error.handler';

/**
 * Service client for handling operations related to campaigns, including creation and retrieval of campaigns.
 * This service interacts with the backend API and manages in-memory caching for optimized requests.
 */
@Injectable({
  providedIn: 'root'
})
export class CampaignClient extends ClientTemplate {
  private readonly sessionStore = inject(SessionStoreService);
  private readonly mapper = inject(CampaignMapper);
  private readonly CAMPAIGN_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL + DFC.RelativePath.GENERAL_PATH + '/campaigns';

  // Simple in-memory cache for observables keyed by `${page}|${limit}`
  private readonly cache = new Map<string, Observable<PaginatedCampaigns>>();

  constructor() {
    super();
  }

  /**
   * Retrieve a single campaign by id.
   * Calls GET /campaigns/:id and returns a normalized Campaign object or a normalized error.
   */
  getCampaign(id: string): Observable<Campaign> {
    this.logInfo('CampaignClient.getCampaign -> GET ' + this.CAMPAIGN_PATH + '/' + id);

    return this.sessionStore.session$.pipe(
      take(1),
      switchMap(session => {
        let sessionTokenBkd: string | undefined = session?.userAuth?.sessionTokenBkd;
        let headers: HttpHeaders = DFC.HttpHeader.STANDARD;
        if (sessionTokenBkd) {
          headers = headers.set(SESSION_TOKEN_BACKEND, sessionTokenBkd);
        }
        return this.httpClient.get<any>(`${this.CAMPAIGN_PATH}/${id}`, { headers });
      }),
      map((response: any) => {
        // Normalize possible shapes
        const dto = response?.data ?? response ?? {};
        return this.mapper.mapToCampaign(dto);
      }),
      catchError((err) => {
        const normalized = sanitizeError(err);
        this.logError('CampaignClient.getCampaign error', normalized);
        return throwError(() => normalized);
      })
    );
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
        const normalized = sanitizeError(err);
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
        const normalized = sanitizeError(err);
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
        const raw = response?.data ?? response?.items ?? response ?? [];
        let arr: any[] = [];
        if (Array.isArray(raw)) {
          arr = raw;
        } else if (raw && Array.isArray(raw.items)) {
          arr = raw.items;
        }
        const items: Campaign[] = arr.map((dto: any) => this.mapper.mapToCampaign(dto));

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
        const normalized = sanitizeError(err);
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
