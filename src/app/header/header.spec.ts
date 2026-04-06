import {BreakpointObserver} from '@angular/cdk/layout';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Renderer2} from '@angular/core';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BehaviorSubject, of} from 'rxjs';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {Header} from './header';
import {HeaderType} from '@shared/constants/header-type';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {HeaderService} from '@app/header/header.service';
import {AuthClient} from '@app/features/auth/auth.client';
import {LoggerService} from '@app/core/services/logger.service';

interface TestUserAuth {
  alias: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  fullName: string;
  sessionToken: string;
  sessionTokenBkd: string;
  authorization: string;
  features: string[];
  businesses: string[];
  verifiedComplete: boolean;
  avatarUrl: string;
  avatarVersion: string;
  initials: string;
}

const createSessionState = (userAuthOverrides: Partial<TestUserAuth> = {}, isInitialized = true): SessionState => {
  const userAuth: TestUserAuth = {
    alias: 'testAlias',
    email: 'test@example.com',
    firstName: 'Pepe',
    lastName: 'Perez',
    displayName: 'Pepe Perez',
    fullName: 'Pepe Perez',
    sessionToken: 'session-token',
    sessionTokenBkd: 'bkd-token',
    authorization: 'bearer token',
    features: [],
    businesses: [],
    verifiedComplete: true,
    avatarUrl: 'https://cdn.example.com/avatar.png',
    avatarVersion: '1',
    initials: 'PP',
    ...userAuthOverrides
  };

  const sessionData: SessionData = {
    token: 'user-token',
    userAuth
  };

  return {
    sessionData,
    isInitialized
  };
};

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let store: MockStore<{ session: SessionState }>;
  let headerType$: BehaviorSubject<HeaderType>;

  beforeEach(async () => {
    headerType$ = new BehaviorSubject<HeaderType>(HeaderType.GENERAL_HEADER);

    await TestBed.configureTestingModule({
      imports: [
        Header,
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
        })
      ],
      providers: [
        provideMockStore({initialState: {session: createSessionState()}}),
        {
          provide: HeaderService,
          useValue: {
            headerType$: headerType$.asObservable(),
            setHeaderType: jasmine.createSpy('setHeaderType').and.callFake((headerType: HeaderType) => headerType$.next(headerType))
          }
        },
        {
          provide: Router,
          useValue: {
            events: of({}),
            navigate: jasmine.createSpy('navigate'),
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
            serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('')
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {}, queryParams: {}},
            params: of({}),
            queryParams: of({})
          }
        },
        {
          provide: SessionStoreService,
          useValue: {clearSessionData: jasmine.createSpy('clearSessionData')}
        },
        {
          provide: AuthClient,
          useValue: {closeSession: jasmine.createSpy('closeSession').and.returnValue(of({}))}
        },
        {
          provide: LoggerService,
          useValue: {
            debug: jasmine.createSpy('debug'),
            info: jasmine.createSpy('info'),
            error: jasmine.createSpy('error')
          }
        },
        {
          provide: BreakpointObserver,
          useValue: {
            observe: jasmine.createSpy('observe').and.returnValue(of({matches: false}))
          }
        },
        {
          provide: Renderer2,
          useValue: {
            listen: jasmine.createSpy('listen').and.returnValue(() => undefined)
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the current display name and cache-busted avatar in the user button', () => {
    component.isMenuOpen = true;
    fixture.detectChanges();

    const avatarImg = fixture.debugElement.query(By.css('header button app-avatar img'));
    const menuDisplayName = fixture.debugElement.query(By.css('app-header-menu p.font-bold'));

    expect(avatarImg.nativeElement.getAttribute('src')).toContain('avatar.png?v=1');
    expect(menuDisplayName.nativeElement.textContent.trim()).toBe('Pepe Perez');
  });

  it('should refresh the user button and menu when the session store changes', () => {
    component.isMenuOpen = true;
    fixture.detectChanges();

    store.setState({
      session: createSessionState({
        firstName: 'Ana',
        lastName: 'García',
        displayName: 'Ana G.',
        fullName: 'Ana García',
        avatarUrl: 'https://cdn.example.com/avatar.png',
        avatarVersion: '2',
        initials: 'AG'
      })
    });
    store.refreshState();
    fixture.detectChanges();

    const avatarImg = fixture.debugElement.query(By.css('header button app-avatar img'));
    const menuDisplayName = fixture.debugElement.query(By.css('app-header-menu p.font-bold'));

    expect(component['userLogger'].displayName).toBe('Ana G.');
    expect(component['userLogger'].fullName).toBe('Ana García');
    expect(avatarImg.nativeElement.getAttribute('src')).toContain('avatar.png?v=2');
    expect(menuDisplayName.nativeElement.textContent.trim()).toBe('Ana G.');
  });

  it('should report business access from the session store', () => {
    store.setState({session: createSessionState({businesses: ['business-1']})});
    store.refreshState();
    fixture.detectChanges();

    expect(component.hasBusiness).toBeTrue();
  });

  it('should return false when the session has no businesses', () => {
    store.setState({session: createSessionState({businesses: []})});
    store.refreshState();
    fixture.detectChanges();

    expect(component.hasBusiness).toBeFalse();
  });
});
