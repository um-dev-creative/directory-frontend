import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  timestamp: number;
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_MAX_AGE = 5 * 60 * 1000; // 5 minutes

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Skip caching if requested
    if (req.headers.get('cache-control') === 'no-cache') {
      return next.handle(req);
    }

    // Check if we have a cached response
    const cachedResponse = this.getFromCache(req);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Make the request and cache the response
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.addToCache(req, event);
        }
      })
    );
  }

  private getFromCache(req: HttpRequest<any>): HttpResponse<any> | null {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      return null;
    }

    // Check if cache entry is still valid
    const maxAge = this.getMaxAge(req);
    const age = Date.now() - cached.timestamp;

    if (age < maxAge) {
      return cached.response;
    }

    // Remove expired entry
    this.cache.delete(url);
    return null;
  }

  private addToCache(req: HttpRequest<any>, response: HttpResponse<any>): void {
    // Don't cache error responses
    if (response.status >= 400) {
      return;
    }

    const url = req.urlWithParams;
    const entry: CacheEntry = {
      url,
      response: response.clone(),
      timestamp: Date.now()
    };

    this.cache.set(url, entry);

    // Cleanup old entries (keep cache size reasonable)
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  private getMaxAge(req: HttpRequest<any>): number {
    const cacheControl = req.headers.get('cache-control');
    if (cacheControl) {
      const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
      if (maxAgeMatch) {
        return parseInt(maxAgeMatch[1]) * 1000;
      }
    }
    return this.DEFAULT_MAX_AGE;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public removeFromCache(url: string): void {
    this.cache.delete(url);
  }
}
