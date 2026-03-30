import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Auth} from './auth';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient} from "@angular/common/http";
import {App} from '@app/app';
import {Store} from "@ngrx/store";
import {AuthClient} from '@app/features/auth/auth.client';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('AuthComponent', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;
  let mockRouter: Router;
  let mockStore: any;

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
        Auth,
        BrowserAnimationsModule
      ],
      providers: [
        App,
        AuthClient,
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { paramMap: convertToParamMap({}) } } },
        {provide: Store, useValue: mockStore},
        {provide: Router, useValue: mockRouter},
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
