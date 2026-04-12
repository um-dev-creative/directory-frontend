import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';

import { PartnerGeneralSettings } from '@app/features/partner';
import { CategoryClient } from '@core/services/category/category.client';
import { TimezoneClient } from '@core/services/timezone/timezone.client';
import { BusinessClient } from '@core/services/business/business.client';
import { NotificationService, PartnerCategoryService, TimezoneService } from '@app/core/services';
import { LoggerService } from '@app/core/services/logger.service';

describe('PartnerGeneralSettings', () => {
  let component: PartnerGeneralSettings;
  let businessClientSpy: jasmine.SpyObj<BusinessClient>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    notificationServiceMock = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);

    const storeMock = {
      select: jasmine.createSpy('select').and.returnValue(of({
        sessionData: {
          userAuth: {
            alias: 'alias',
            email: 'contacto@nuevosabor.com',
            firstName: 'Nuevo',
            lastName: 'Sabor',
            displayName: 'Nuevo Sabor',
            fullName: 'Nuevo Sabor',
            sessionToken: 'session-token',
            sessionTokenBkd: 'session-token-bkd',
            authorization: 'authorization',
            features: [],
            businesses: ['biz-123']
          },
          token: 'token'
        },
        isInitialized: true
      }))
    };

    const categoryClientMock = jasmine.createSpyObj<CategoryClient>('CategoryClient', ['getCategories']);
    categoryClientMock.getCategories.and.returnValue(of({
      headers: { status: 200 },
      data: []
    }));

    const timezoneClientMock = jasmine.createSpyObj<TimezoneClient>('TimezoneClient', ['getTimezones']);
    timezoneClientMock.getTimezones.and.returnValue(of({
      headers: { status: 200 },
      data: { total: 0, timezones: [] }
    }));

    businessClientSpy = jasmine.createSpyObj<BusinessClient>('BusinessClient', ['getBusinessById', 'updateBusiness', 'updateBusinessImage']);
    businessClientSpy.getBusinessById.and.returnValue(of({
      headers: { status: 200 },
      data: {
        name: 'El nuevo sabor',
        description: 'Es la descripcion del nuevo sabor.',
        profileImageRef: 'https://cdn.example.com/current-logo.png',
        customerServiceEmail: 'customer@nuevosabor111.com',
        orderManagementEmail: 'management@nuevosabor111.com',
        website: 'nuevosabor.com111',
        categoryId: '3536c5be-e56a-4a22-8f3c-d36da4a86f61',
        timezoneId: 'UTC',
        verified: false
      }
    }));
    businessClientSpy.updateBusiness.and.returnValue(of({ updatedDate: '2026-04-10T18:05:19' }));

    const routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const partnerCategoryServiceMock = jasmine.createSpyObj<PartnerCategoryService>('PartnerCategoryService', ['searchCategories']);
    const timezoneServiceMock = jasmine.createSpyObj<TimezoneService>('TimezoneService', ['searchTimezones']);
    const loggerMock = jasmine.createSpyObj<LoggerService>('LoggerService', ['info', 'debug', 'error']);

    await TestBed.configureTestingModule({
      imports: [PartnerGeneralSettings],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: CategoryClient, useValue: categoryClientMock },
        { provide: TimezoneClient, useValue: timezoneClientMock },
        { provide: BusinessClient, useValue: businessClientSpy },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: PartnerCategoryService, useValue: partnerCategoryServiceMock },
        { provide: TimezoneService, useValue: timezoneServiceMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    }).overrideComponent(PartnerGeneralSettings, {
      set: { template: '' }
    }).compileComponents();

    const fixture = TestBed.createComponent(PartnerGeneralSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call updateBusiness with backend payload and business id on submit', () => {
    component.generalForm.patchValue({
      partnerName: 'El nuevo sabor',
      partnerDescription: 'Es la descripcion del nuevo sabor.',
      customerServiceEmail: 'customer@nuevosabor111.com',
      orderManagementEmail: 'management@nuevosabor111.com',
      category: '3536c5be-e56a-4a22-8f3c-d36da4a86f61',
      timezone: 'UTC'
    });
    component.generalForm.markAsDirty();
    component.onSubmit();

    expect(businessClientSpy.updateBusiness).toHaveBeenCalledWith('biz-123', {
      name: 'El nuevo sabor',
      description: 'Es la descripcion del nuevo sabor.',
      categoryId: '3536c5be-e56a-4a22-8f3c-d36da4a86f61',
      email: 'contacto@nuevosabor.com',
      customerServiceEmail: 'customer@nuevosabor111.com',
      orderManagementEmail: 'management@nuevosabor111.com',
      website: 'nuevosabor.com111'
    });
    expect(component.isSubmitting).toBeFalse();
    expect(component.generalForm.pristine).toBeTrue();
  });

  describe('image upload flow', () => {
    it('should call updateBusinessImage with FormData containing image field', () => {
      const mockFile = new File(['img'], 'logo.png', { type: 'image/png' });
      businessClientSpy.updateBusinessImage.and.returnValue(
        of({ imageUrl: 'https://cdn.example.com/biz-logo.png', updatedDate: '2026-04-12T10:00:00' })
      );

      businessClientSpy.updateBusinessImage.and.callFake((id, formData) => {
        expect(id).toBe('biz-123');
        expect(formData.get('image')).toBeTruthy();
        return of({ imageUrl: 'https://cdn.example.com/biz-logo.png', updatedDate: '2026-04-12T10:00:00' });
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(mockFile);
      const input = document.createElement('input');
      input.type = 'file';
      Object.defineProperty(input, 'files', { value: dataTransfer.files });

      component.onImageSelect({ target: input } as unknown as Event);

      expect(businessClientSpy.updateBusinessImage).toHaveBeenCalled();
    });

    it('should update partnerImage and keep imagePreview on success', () => {
      component.imagePreview = 'data:image/png;base64,abc';
      businessClientSpy.updateBusinessImage.and.returnValue(
        of({ imageUrl: 'https://cdn.example.com/biz-logo.png', updatedDate: '2026-04-12T10:00:00' })
      );

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(['img'], 'logo.png', { type: 'image/png' }));
      const input = document.createElement('input');
      input.type = 'file';
      Object.defineProperty(input, 'files', { value: dataTransfer.files });

      component.onImageSelect({ target: input } as unknown as Event);

      expect(component.partnerData.partnerImage).toContain('https://cdn.example.com/current-logo.png');
      expect(component.imagePreview).toBe('data:image/png;base64,abc');
      expect(component.uploadingImage).toBeFalse();
    });

    it('should map alternate response key logoUrl into partnerImage', () => {
      businessClientSpy.updateBusinessImage.and.returnValue(
        of({ logoUrl: 'https://cdn.example.com/biz-logo-alt.png', updatedDate: '2026-04-12T10:00:00' } as any)
      );

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(['img'], 'logo.png', { type: 'image/png' }));
      const input = document.createElement('input');
      input.type = 'file';
      Object.defineProperty(input, 'files', { value: dataTransfer.files });

      component.onImageSelect({ target: input } as unknown as Event);

      expect(component.partnerData.partnerImage).toContain('https://cdn.example.com/biz-logo-alt.png');
    });

    it('should show error notification and clear imagePreview on failure', () => {
      component.imagePreview = 'data:image/png;base64,abc';
      businessClientSpy.updateBusinessImage.and.returnValue(throwError(() => new Error('Upload failed')));

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(['img'], 'logo.png', { type: 'image/png' }));
      const input = document.createElement('input');
      input.type = 'file';
      Object.defineProperty(input, 'files', { value: dataTransfer.files });

      component.onImageSelect({ target: input } as unknown as Event);

      expect(notificationServiceMock.error).toHaveBeenCalledWith('Error al actualizar la imagen del negocio');
      expect(component.imagePreview).toBeNull();
      expect(component.uploadingImage).toBeFalse();
    });

    it('should keep previous partnerImage on failure', () => {
      component.partnerData.partnerImage = 'https://cdn.example.com/previous.png';
      businessClientSpy.updateBusinessImage.and.returnValue(throwError(() => new Error('Upload failed')));

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(['img'], 'logo.png', { type: 'image/png' }));
      const input = document.createElement('input');
      input.type = 'file';
      Object.defineProperty(input, 'files', { value: dataTransfer.files });

      component.onImageSelect({ target: input } as unknown as Event);

      expect(component.partnerData.partnerImage).toBe('https://cdn.example.com/previous.png');
    });
  });

  it('should load partner image from business details when available', () => {
    expect(component.partnerData.partnerImage).toBe('https://cdn.example.com/current-logo.png');
  });
});
