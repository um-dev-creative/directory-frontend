import {AlertService} from "@app/core/services101/alert.service";
import {TestBed} from "@angular/core/testing";
import {Router} from "@angular/router";
import {of} from "rxjs";

describe('AlertService', () => {
  let service: AlertService;
  let mockRouter: Router;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      events: of({}) // Mock the events property
    } as any;

    TestBed.configureTestingModule({
      imports: [],
      providers: [AlertService]
    });
    service = TestBed.inject(AlertService);
  });


  it('should create the services', () => {
    expect(service).toBeTruthy();
  });

  it('should send success alert', () => {
    service.success('Success message');
    service.getAlert().subscribe(alert => {
      expect(alert).toEqual({type: 'success', text: 'Success message', duration: 5});
    });
  });

  it('should send error alert', () => {
    service.error('Error message');
    service.getAlert().subscribe(alert => {
      expect(alert).toEqual({type: 'error', text: 'Error message'});
    });
  });

  it('should clear alert on route change', () => {
    service.success('Success message', true);
    service.clear();
    service.getAlert().subscribe(alert => {
      expect(alert).toEqual('');
    });
  });

  it('should keep alert after route change if flag is true', () => {
    service.success('Success message', true);
    service.getAlert().subscribe(alert => {
      expect(alert).toEqual({type: 'success', text: 'Success message', duration: 5});
    });
  });

  it('should clear alert if flag is false', () => {
    service.success('Success message', false);
    service.clear();
    service.getAlert().subscribe(alert => {
      expect(alert).toEqual('');
    });
  });
});
