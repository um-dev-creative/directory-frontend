import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { LoggerService } from '@app/core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class UserMockService {
  private readonly apiUrl = '/api/users';

  // For testing - set to true to use mock data
  private useMockData = true;

  constructor(private http: HttpClient) {}
  private readonly logger = inject(LoggerService);

  uploadAvatar(file: File): Observable<{ url: string }> {
    if (this.useMockData) {
      const mockUrl = `https://via.placeholder.com/200x200/06B6D4/ffffff?text=${encodeURIComponent(file.name.split('.')[0])}`;
      this.logger.debug('Mock: Uploading user avatar', file.name);
      return of({ url: mockUrl }).pipe(delay(2000));
    }

    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload/avatar`, formData);
  }

  updateProfile(userData: any): Observable<any> {
    if (this.useMockData) {
      this.logger.debug('Mock: Updating user profile', userData);
      return of({ success: true, data: userData }).pipe(delay(1000));
    }

    return this.http.put<any>(`${this.apiUrl}/profile`, userData);
  }
}
