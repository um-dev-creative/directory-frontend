import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DFC, SESSION_TOKEN_BACKEND} from '@app/shared/constants/app.const';
import {catchError, map, Observable, throwError, switchMap, take} from 'rxjs';
import {CampaignCreateRequest, CampaignCreateResponse} from '@shared/models/campaign.model';
import {ServiceTemplate} from '@app/core/services/service-template';
import {SessionStoreService} from '@app/core/store/session/session-store.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignClient extends ServiceTemplate {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly sessionStore = inject(SessionStoreService);
  private readonly CAMPAIGN_PATH: string = DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL + DFC.RelativePath.GENERAL_PATH + '/campaigns';

  constructor() {
    super();
  }

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
        return this.httpClient.post<CampaignCreateResponse>(this.CAMPAIGN_PATH, request, {headers, observe: 'response' as const});
      }),
      map(response => ({ status: (response as any).status, body: (response as any).body })),
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
}
