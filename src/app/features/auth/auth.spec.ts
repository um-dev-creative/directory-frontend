import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Auth} from './auth';
import {DebugElement} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {App} from '@app/app';
import {Stage} from '@app/stage/stage';
import {Store} from "@ngrx/store";
import {AuthClient} from '@app/features/auth/auth.client';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('AuthComponent', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;
  let authClient: AuthClient;
  let debugElement: DebugElement;
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
        BrowserAnimationsModule,
        RouterModule.forRoot(
          [{path: '', component: Stage}, {path: 'simple', component: Stage}]
        )
      ],
      providers: [
        App,
        AuthClient,
        provideHttpClientTesting(),
        {provide: Store, useValue: mockStore},
        {provide: Router, useValue: mockRouter},
        provideHttpClient(withInterceptorsFromDi()),
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auth);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    authClient = debugElement.injector.get(AuthClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
