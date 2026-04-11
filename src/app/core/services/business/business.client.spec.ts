import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BusinessClient } from './business.client';
import { BusinessUpdateRequest } from '@shared/models/business.model';
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
