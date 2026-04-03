import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, shareReplay } from 'rxjs/operators';
import { HttpService } from '@core/services/http.service';
import { LoggerService } from '@core/services/logger.service';
import { LandingResponse } from '@shared/models/landing.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingService {
  private readonly http = inject(HttpService);
  private readonly logger = inject(LoggerService);

  private readonly endpoint = environment.useMocks
    ? '/assets/mocks/landing.json'
    : '/api/landing';

  private readonly landing$ = this.http.get<LandingResponse>(this.endpoint).pipe(
    environment.useMocks ? delay(5000) : delay(0),
    shareReplay(1),
    catchError((error) => {
      this.logger.error('Error al cargar los datos de la landing page', error);
      return throwError(() => error);
    })
  );

  getLanding(): Observable<LandingResponse> {
    return this.landing$;
  }
}
