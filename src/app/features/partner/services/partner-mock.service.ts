import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { CreatePartnerRequest, UpdatePartnerRequest, Partner } from './partner-registration.service';

@Injectable({
  providedIn: 'root'
})
export class PartnerMockService {
  private partners: Partner[] = [];
  private currentId = 1;
  private currentPartnerSubject = new BehaviorSubject<Partner | null>(null);

  currentPartner$ = this.currentPartnerSubject.asObservable();

  constructor() {
    // Initialize with some mock data
    this.partners = [
      {
        id: 'partner-001',
        name: 'Restaurante El Buen Sabor',
        description: 'Restaurante familiar especializado en cocina tradicional mexicana. Ofrecemos desayunos, comidas y cenas preparadas con ingredientes frescos y locales. Ambiente acogedor ideal para familias y eventos especiales.',
        avatar: 'https://via.placeholder.com/200x200/10B981/ffffff?text=RBS',
        logo: 'https://via.placeholder.com/400x200/10B981/ffffff?text=Restaurant+Logo',
        country: 'MX',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'partner-002',
        name: 'Café Digital',
        description: 'Espacio de coworking y café para profesionales digitales. Ofrecemos café de especialidad, internet de alta velocidad y espacios de trabajo colaborativo.',
        avatar: 'https://via.placeholder.com/200x200/06B6D4/ffffff?text=CD',
        logo: 'https://via.placeholder.com/400x200/06B6D4/ffffff?text=Cafe+Digital',
        country: 'CO',
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];
  }

  createPartner(data: CreatePartnerRequest): Observable<Partner> {
    const newPartner: Partner = {
      id: `partner-${String(this.currentId++).padStart(3, '0')}`,
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    this.partners.push(newPartner);
    console.log('🎯 Mock: Created partner:', newPartner);

    // Simulate API delay
    return of(newPartner).pipe(delay(1500));
  }

  updatePartner(id: string, data: UpdatePartnerRequest): Observable<Partner> {
    const partnerIndex = this.partners.findIndex(p => p.id === id);

    if (partnerIndex === -1) {
      throw new Error(`Partner with ID ${id} not found`);
    }

    const updatedPartner: Partner = {
      ...this.partners[partnerIndex],
      ...data
    };

    // If this is the final update (has country), mark as active
    if (data.country) {
      updatedPartner.status = 'active';
    }

    this.partners[partnerIndex] = updatedPartner;
    console.log('🎯 Mock: Updated partner:', updatedPartner);

    // Simulate API delay
    return of(updatedPartner).pipe(delay(1000));
  }

  uploadLogo(file: File): Observable<{ url: string }> {
    // Simulate file upload
    const mockUrl = `https://via.placeholder.com/400x200/10B981/ffffff?text=${encodeURIComponent(file.name.split('.')[0])}`;

    console.log('🎯 Mock: Uploading logo:', file.name);

    // Simulate upload delay
    return of({ url: mockUrl }).pipe(delay(2000));
  }

  uploadAvatar(file: File): Observable<{ url: string }> {
    // Simulate file upload
    const mockUrl = `https://via.placeholder.com/200x200/06B6D4/ffffff?text=${encodeURIComponent(file.name.split('.')[0])}`;

    console.log('🎯 Mock: Uploading avatar:', file.name);

    // Simulate upload delay
    return of({ url: mockUrl }).pipe(delay(2000));
  }

  getPartner(id: string): Observable<Partner | null> {
    const partner = this.partners.find(p => p.id === id);
    console.log('🎯 Mock: Getting partner:', partner);

    return of(partner || null).pipe(delay(500));
  }

  getAllPartners(): Observable<Partner[]> {
    console.log('🎯 Mock: Getting all partners:', this.partners);

    return of([...this.partners]).pipe(delay(500));
  }

  setCurrentPartner(partner: Partner): void {
    this.currentPartnerSubject.next(partner);
    console.log('🎯 Mock: Set current partner:', partner);
  }

  getCurrentPartner(): Partner | null {
    return this.currentPartnerSubject.value;
  }

  clearCurrentPartner(): void {
    this.currentPartnerSubject.next(null);
    console.log('🎯 Mock: Cleared current partner');
  }

  // Helper method to simulate network errors (for testing)
  simulateError(): Observable<never> {
    throw new Error('Simulated network error');
  }
}
