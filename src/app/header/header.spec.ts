import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Header} from './header';
import {DebugElement} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {App} from '@app/app';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {provideLocationMocks} from '@angular/common/testing';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let sessionStoreService: any;
  let debugElement: DebugElement;
  let mockRouter: Router;
  let mockStore: any;
  let mockActivatedRoute: any;

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
      events: of({}), // Mock the events property
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('')
    } as any;
    mockActivatedRoute = {
      snapshot: { params: {}, queryParams: {} },
      params: of({}),
      queryParams: of({})
    };
    await TestBed.configureTestingModule({
      imports: [
        Header,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
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
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
        provideLocationMocks()
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

  describe('hasBusiness getter - business role detection', () => {
    const BUSINESS_ROLE_ID = '9a232260-a2e3-4990-b062-b6966efb25f8';
    const OTHER_ROLE_ID = '12345678-1234-1234-1234-123456789012';

    it('should return true when businessAssigned is an Array<string> containing business role ID', () => {
      (component as any).businessAssigned = [BUSINESS_ROLE_ID];
      expect(component.hasBusiness).toBe(true);
    });

    it('should return true when businessAssigned is an Array<string> with multiple roles including business role', () => {
      (component as any).businessAssigned = [OTHER_ROLE_ID, BUSINESS_ROLE_ID, 'some-other-role'];
      expect(component.hasBusiness).toBe(true);
    });

    it('should return false when businessAssigned is an Array<string> NOT containing business role ID', () => {
      (component as any).businessAssigned = [OTHER_ROLE_ID, 'another-role'];
      expect(component.hasBusiness).toBe(false);
    });

    it('should return false when businessAssigned is an empty array', () => {
      (component as any).businessAssigned = [];
      expect(component.hasBusiness).toBe(false);
    });

    it('should return true when businessAssigned is a JSON string of array containing business role ID', () => {
      (component as any).businessAssigned = `["${BUSINESS_ROLE_ID}"]`;
      expect(component.hasBusiness).toBe(true);
    });

    it('should return true when businessAssigned is a JSON string with multiple roles including business role', () => {
      (component as any).businessAssigned = `["${OTHER_ROLE_ID}","${BUSINESS_ROLE_ID}","other-role"]`;
      expect(component.hasBusiness).toBe(true);
    });

    it('should return false when businessAssigned is a JSON string of array NOT containing business role ID', () => {
      (component as any).businessAssigned = `["${OTHER_ROLE_ID}","another-role"]`;
      expect(component.hasBusiness).toBe(false);
    });

    it('should return false when businessAssigned is a JSON string of empty array', () => {
      (component as any).businessAssigned = '[]';
      expect(component.hasBusiness).toBe(false);
    });

    it('should return true when businessAssigned is a comma-separated string containing business role ID', () => {
      (component as any).businessAssigned = `${OTHER_ROLE_ID},${BUSINESS_ROLE_ID},another-role`;
      expect(component.hasBusiness).toBe(true);
    });

    it('should return false when businessAssigned is a comma-separated string NOT containing business role ID', () => {
      (component as any).businessAssigned = `${OTHER_ROLE_ID},another-role`;
      expect(component.hasBusiness).toBe(false);
    });

    it('should return true when businessAssigned contains whitespace in comma-separated format', () => {
      (component as any).businessAssigned = `${OTHER_ROLE_ID}, ${BUSINESS_ROLE_ID} , another-role`;
      expect(component.hasBusiness).toBe(true);
    });

    it('should return true when businessAssigned is a single string matching business role ID', () => {
      (component as any).businessAssigned = BUSINESS_ROLE_ID;
      expect(component.hasBusiness).toBe(true);
    });

    it('should return false when businessAssigned is a single string NOT matching business role ID', () => {
      (component as any).businessAssigned = OTHER_ROLE_ID;
      expect(component.hasBusiness).toBe(false);
    });

    it('should return false when businessAssigned is null', () => {
      (component as any).businessAssigned = null;
      expect(component.hasBusiness).toBe(false);
    });

    it('should return false when businessAssigned is undefined', () => {
      (component as any).businessAssigned = undefined;
      expect(component.hasBusiness).toBe(false);
    });

    it('should return false when businessAssigned is an empty string', () => {
      (component as any).businessAssigned = '';
      expect(component.hasBusiness).toBe(false);
    });

    it('should handle JSON string with spaces correctly', () => {
      (component as any).businessAssigned = `[ "${OTHER_ROLE_ID}", "${BUSINESS_ROLE_ID}", "other-role" ]`;
      expect(component.hasBusiness).toBe(true);
    });

    it('should return false when businessAssigned is invalid JSON string', () => {
      (component as any).businessAssigned = `{invalid json}`;
      expect(component.hasBusiness).toBe(false);
    });
  });

  describe('hasBusiness template integration', () => {
    const BUSINESS_ROLE_ID = '9a232260-a2e3-4990-b062-b6966efb25f8';
    const OTHER_ROLE_ID = '12345678-1234-1234-1234-123456789012';

    it('should correctly compute hasBusiness getter for template usage with business role', () => {
      (component as any).businessAssigned = [BUSINESS_ROLE_ID];
      expect(component.hasBusiness).toBe(true);
    });

    it('should correctly compute hasBusiness getter for template usage without business role', () => {
      (component as any).businessAssigned = [OTHER_ROLE_ID];
      expect(component.hasBusiness).toBe(false);
    });

    it('should react to changes in businessAssigned for template binding', () => {
      // Initially no business role
      (component as any).businessAssigned = [OTHER_ROLE_ID];
      expect(component.hasBusiness).toBe(false);

      // Add business role
      (component as any).businessAssigned = [BUSINESS_ROLE_ID];
      expect(component.hasBusiness).toBe(true);

      // Remove business role
      (component as any).businessAssigned = [];
      expect(component.hasBusiness).toBe(false);
    });

    it('should work with businessAssigned as comma-separated string for template binding', () => {
      (component as any).businessAssigned = `${OTHER_ROLE_ID},${BUSINESS_ROLE_ID}`;
      expect(component.hasBusiness).toBe(true);

      (component as any).businessAssigned = OTHER_ROLE_ID;
      expect(component.hasBusiness).toBe(false);
    });

    it('should work with businessAssigned as JSON string for template binding', () => {
      (component as any).businessAssigned = `["${BUSINESS_ROLE_ID}","${OTHER_ROLE_ID}"]`;
      expect(component.hasBusiness).toBe(true);

      (component as any).businessAssigned = `["${OTHER_ROLE_ID}"]`;
      expect(component.hasBusiness).toBe(false);
    });
  });
});
