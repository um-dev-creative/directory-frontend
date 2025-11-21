import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Partner} from './partner';
import {provideLocationMocks} from '@angular/common/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {of} from 'rxjs';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';

class MockBackboneJwtPipe {
  transform = jasmine.createSpy().and.returnValue({ uid: '1', roles: ['user'] });
}

describe('Partner', () => {
  let component: Partner;
  let fixture: ComponentFixture<Partner>;
  let mockStore: any;
  let backboneJwtPipe: MockBackboneJwtPipe;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy().and.returnValue(of({
        logged: false,
        userAuth: {alias: 'testAlias', fullName: 'Pepe Perez'}
      })),
      dispatch: jasmine.createSpy()
    };
    await TestBed.configureTestingModule({
      imports: [Partner],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), paramMap: of(convertToParamMap({})), queryParams: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        {provide: Store, useValue: mockStore},
        { provide: BackboneJwtPipe, useClass: MockBackboneJwtPipe },
        provideLocationMocks(),
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Partner);
    backboneJwtPipe = TestBed.inject(BackboneJwtPipe) as any;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
