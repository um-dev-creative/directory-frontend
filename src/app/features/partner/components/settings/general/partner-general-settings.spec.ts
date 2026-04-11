import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { PartnerGeneralSettings } from './partner-general-settings';
import { CategoryClient } from '@core/services/category/category.client';
import { TimezoneClient } from '@core/services/timezone/timezone.client';
import { BusinessClient } from '@core/services/business/business.client';
import { PartnerCategoryService, TimezoneService } from '@app/core/services';
import { LoggerService } from '@app/core/services/logger.service';

describe('PartnerGeneralSettings', () => {
  let component: PartnerGeneralSettings;
  let businessClientSpy: jasmine.SpyObj<BusinessClient>;

  beforeEach(async () => {
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
      data: {
        total: 0,
        timezones: []
      }
    }));

    businessClientSpy = jasmine.createSpyObj<BusinessClient>('BusinessClient', ['getBusinessById', 'updateBusiness']);
    businessClientSpy.getBusinessById.and.returnValue(of({
      headers: { status: 200 },
      data: {
        name: 'El nuevo sabor',
        description: 'Es la descripcion del nuevo sabor.',
        customerServiceEmail: 'customer@nuevosabor111.com',
        orderManagementEmail: 'management@nuevosabor111.com',
        website: 'nuevosabor.com111',
        categoryId: '3536c5be-e56a-4a22-8f3c-d36da4a86f61',
        timezoneId: 'UTC',
        verified: false
      }
    }));
    businessClientSpy.updateBusiness.and.returnValue(of({
      updatedDate: '2026-04-10T18:05:19'
    }));

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
        { provide: Router, useValue: routerMock },
        { provide: PartnerCategoryService, useValue: partnerCategoryServiceMock },
        { provide: TimezoneService, useValue: timezoneServiceMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    }).overrideComponent(PartnerGeneralSettings, {
      set: {
        template: ''
      }
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
});

