import {TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {VerifyCodeClient} from './verify-code-client.service';
import {provideHttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {provideLocationMocks} from '@angular/common/testing';

describe('VerifyCodeClient', () => {
  let service: VerifyCodeClient;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy().and.returnValue(of({
        logged: false,
        userAuth: {alias: 'testAlias', fullName: 'Pepe Perez'}
      })),
      dispatch: jasmine.createSpy()
    };
    TestBed.configureTestingModule({
      providers: [
        {provide: Store, useValue: mockStore},
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    });
    service = TestBed.inject(VerifyCodeClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have confirmCode method', () => {
    expect(typeof service.confirmCode).toBe('function');
  });

  it('should return an observable from confirmCode', () => {
    const result = service.confirmCode({ code: '123456' });
    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });
});
