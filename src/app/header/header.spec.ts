import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Header} from './header';
import {DebugElement} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Stage} from '@app/features/stage/stage';
import {App} from '@app/app';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {Store} from '@ngrx/store';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let sessionStoreService: any;
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
        Header,
        BrowserAnimationsModule,
        RouterModule.forRoot(
          [{path: '', component: Stage}, {path: 'simple', component: Stage}]
        ), TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })],
      providers: [
        App,
        SessionStoreService,
        provideHttpClientTesting(),
        {provide: Store, useValue: mockStore},
        {provide: Router, useValue: mockRouter},
        provideHttpClient(withInterceptorsFromDi()),
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Header);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    sessionStoreService = debugElement.injector.get(SessionStoreService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
