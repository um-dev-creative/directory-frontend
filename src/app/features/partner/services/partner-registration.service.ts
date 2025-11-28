import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, delay } from 'rxjs';
import { LoggerService } from '@app/core/services/logger.service';

export interface CreatePartnerRequest {
  name: string;
  description: string;
}

export interface UpdatePartnerRequest {
  avatar?: string;
  logo?: string;
  country?: string;
}

export interface Partner {
  id: number;
  slug: string;
  name: string;
  description: string;
  avatar?: string;
  logo?: string;
  country?: string;
  createdAt: string;
  status: 'draft' | 'active' | 'pending';
}

@Injectable({
  providedIn: 'root'
})
export class PartnerRegistrationService {
  private readonly apiUrl = '/api/partners';
  private currentPartnerSubject = new BehaviorSubject<Partner | null>(null);

  // For testing - set to true to use mock data
  private useMockData = true;
  private mockPartners: Partner[] = [];
  private currentId = 1;

  currentPartner$ = this.currentPartnerSubject.asObservable();

  private readonly logger = inject(LoggerService);

  constructor(private http: HttpClient) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w]/g, '') // Remove all non-alphanumeric characters (spaces, hyphens, special chars)
      .trim();
  }

  createPartner(data: CreatePartnerRequest): Observable<Partner> {
    if (this.useMockData) {
      const newPartner: Partner = {
        id: this.currentId++,
        slug: this.generateSlug(data.name),
        name: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      this.mockPartners.push(newPartner);
      this.logger.debug('Mock: Created partner', newPartner);

      return of(newPartner).pipe(delay(1500));
    }

    return this.http.post<Partner>(`${this.apiUrl}`, data);
  }

  updatePartner(id: number, data: UpdatePartnerRequest): Observable<Partner> {
    if (this.useMockData) {
      const partnerIndex = this.mockPartners.findIndex(p => p.id === id);

      if (partnerIndex === -1) {
        throw new Error(`Partner with ID ${id} not found`);
      }

      const updatedPartner: Partner = {
        ...this.mockPartners[partnerIndex],
        ...data
      };

      // If this is the final update (has country), mark as active
      if (data.country) {
        updatedPartner.status = 'active';
      }

      this.mockPartners[partnerIndex] = updatedPartner;
      this.logger.debug('Mock: Updated partner', updatedPartner);

      return of(updatedPartner).pipe(delay(1000));
    }

    return this.http.patch<Partner>(`${this.apiUrl}/${id}`, data);
  }

  uploadLogo(file: File): Observable<{ url: string }> {
    if (this.useMockData) {
      const mockUrl = `https://via.placeholder.com/400x200/10B981/ffffff?text=${encodeURIComponent(file.name.split('.')[0])}`;
      this.logger.debug('Mock: Uploading logo', file.name);
      return of({ url: mockUrl }).pipe(delay(2000));
    }

    const formData = new FormData();
    formData.append('logo', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload/logo`, formData);
  }

  uploadAvatar(file: File): Observable<{ url: string }> {
    if (this.useMockData) {
      const mockUrl = `https://via.placeholder.com/200x200/06B6D4/ffffff?text=${encodeURIComponent(file.name.split('.')[0])}`;
      this.logger.debug('Mock: Uploading avatar', file.name);
      return of({ url: mockUrl }).pipe(delay(2000));
    }

    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload/avatar`, formData);
  }

  setCurrentPartner(partner: Partner): void {
    this.currentPartnerSubject.next(partner);
  }

  getCurrentPartner(): Partner | null {
    return this.currentPartnerSubject.value;
  }

  clearCurrentPartner(): void {
    this.currentPartnerSubject.next(null);
  }
}
