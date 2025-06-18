import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {LoadingService} from '@app/core/services';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private readonly loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading for certain requests if needed
    if (req.headers.get('skip-loading') === 'true') {
      return next.handle(req);
    }

    this.totalRequests++;
    this.loadingService.showGlobal();

    return next.handle(req).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.hideGlobal();
        }
      })
    );
  }
}
