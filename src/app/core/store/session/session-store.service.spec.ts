import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {SessionData} from '@app/core/store/session/session.state';
import {SessionStoreService} from './session-store.service';
import {Component} from '@angular/core';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-test-store',
  standalone: false,
  template: ''
})
class SessionStoreServiceTest extends SessionStoreService {
  constructor(store: Store<{ session: SessionData }>) {
    super(store);
  }
}

describe('SessionStoreService', () => {
  let component: SessionStoreServiceTest;
  let fixture: ComponentFixture<SessionStoreServiceTest>;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy(),
      dispatch: jasmine.createSpy()
    };

    mockRouter = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      declarations: [SessionStoreServiceTest],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionStoreServiceTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  mockStore = {
    select: jasmine.createSpy(),
    dispatch: jasmine.createSpy() // Add this line to mock the dispatch method
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
