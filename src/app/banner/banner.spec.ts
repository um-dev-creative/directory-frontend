import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Banner} from './banner';
import {DebugElement} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {of} from 'rxjs';
import {provideMockStore} from '@ngrx/store/testing';

describe('BannerComponent', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;
  let debugElement: DebugElement;
  let mockStore: any;
  let mockRouter: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy().and.returnValue(of({
        logged: false,
        userAuth: {alias: 'testAlias', fullName: 'Pepe Perez'}
      })),
      dispatch: jasmine.createSpy()
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      events: of({}) // Mock the events property
    } as any;
    await TestBed.configureTestingModule({
      imports: [
        Banner,
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClientTesting(),
        {provide: Router, useValue: mockRouter},
        provideHttpClient(withInterceptorsFromDi()),
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
        provideMockStore()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
