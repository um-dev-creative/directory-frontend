import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BusinessClient } from './business.client';
import { BusinessImageUpdateResponse, BusinessUpdateRequest } from '@shared/models/business.model';
import { DFC } from '@shared/constants/app.const';

describe('BusinessClient', () => {
  let service: BusinessClient;
  let httpMock: HttpTestingController;

  const BUSINESS_URL = `${DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL}${DFC.RelativePath.GENERAL_PATH}${DFC.RelativePath.BUSINESS_PATH}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BusinessClient]
    });
    service = TestBed.inject(BusinessClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateBusinessImage()', () => {
    it('should send a POST request with the correct URL and FormData', () => {
      const businessId = '11111111-1111-4111-8111-111111111111';
      const expectedUrl = `${DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL}${DFC.RelativePath.D_IMAGE_PATH}${DFC.RelativePath.BUSINESS_PATH}/${businessId}`;
      const mockResponse: BusinessImageUpdateResponse = {
        imageUrl: 'https://cdn.example.com/biz-logo.png',
        updatedDate: '2026-04-12T10:00:00'
      };
      const formData = new FormData();
      formData.append('imageData', new Blob(['img']), 'logo.png');

      service.updateBusinessImage(businessId, formData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should propagate errors for store/effect consumption', () => {
      const businessId = '11111111-1111-4111-8111-111111111111';
      const expectedUrl = `${DFC.RelativePath.DIRECTORY_BACKEND_BASE_URL}${DFC.RelativePath.D_IMAGE_PATH}${DFC.RelativePath.BUSINESS_PATH}/${businessId}`;
      let errorThrown = false;

      service.updateBusinessImage(businessId, new FormData()).subscribe({
        error: () => { errorThrown = true; }
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush({ error: 'Internal Server Error' }, { status: 500, statusText: 'Server Error' });
      expect(errorThrown).toBeTrue();
    });
  });

  describe('updateBusiness()', () => {
    it('should send a PATCH request with the correct URL and body', () => {
      const id = 'biz-123';
      const payload: BusinessUpdateRequest = {
        name: 'Nuevo nombre',
        description: 'Nueva descripcion',
        website: 'https://nuevo.com'
      };

      service.updateBusiness(id, payload).subscribe((response) => {
        expect(response).toEqual({ updatedDate: '2026-04-10T18:05:19' });
      });

      const req = httpMock.expectOne(`${BUSINESS_URL}/${id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(payload);

      req.flush({ updatedDate: '2026-04-10T18:05:19' });
    });
  });
});
