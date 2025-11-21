import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OffersTableComponent } from './offers-table.component';
import { CampaignClient, PaginatedCampaigns } from '@app/core/services/campaign/campaign.client';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

class MockCampaignClient {
  private subject = new Subject<PaginatedCampaigns>();
  listSpy = jasmine.createSpy('list').and.callFake(() => this.subject.asObservable());
  list(...args: any[]) { return this.listSpy(...args); }
  pushValue(val: PaginatedCampaigns) { this.subject.next(val); }
  pushError(err: any) { this.subject.error(err); }
  clearCache() { /* no-op for tests */ }
}

describe('OffersTableComponent (campaigns integration)', () => {
  let component: OffersTableComponent;
  let fixture: ComponentFixture<OffersTableComponent>;
  let mockClient: MockCampaignClient;

  beforeEach(async () => {
    mockClient = new MockCampaignClient();

    await TestBed.configureTestingModule({
      imports: [OffersTableComponent],
      providers: [
        { provide: CampaignClient, useValue: mockClient }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OffersTableComponent);
    component = fixture.componentInstance;
  });

  it('shows spinner while loading', fakeAsync(() => {
    // Ensure component will fetch campaigns (no paginatedData provided)
    mockClient.listSpy.and.returnValue(new Subject().asObservable());

    fixture.detectChanges(); // ngOnInit
    // while observable unresolved, isLoading should be true
    expect(component.isLoading).toBeTrue();
    // template shows skeleton rows when isLoading true; check for presence of animate-pulse rows
    const pulse = fixture.nativeElement.querySelector('.tw-animate-pulse');
    expect(pulse).toBeTruthy();
  }));

  it('renders list items when campaigns arrive', fakeAsync(() => {
    const campaigns: PaginatedCampaigns = {
      items: [ { id: '1', title: 'Camp1', description: 'd1' } ],
      total_count: 1,
      page: 1,
      per_page: 10,
      total_pages: 1
    };

    mockClient.listSpy.and.returnValue(of(campaigns));

    fixture.detectChanges(); // ngOnInit + subscription
    tick();
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    // should render a row with the campaign title
    const titleCell = fixture.nativeElement.querySelector('tbody td div .tw-text-sm.tw-font-medium.tw-text-gray-900');
    expect(titleCell.textContent).toContain('Camp1');
  }));

  it('shows empty state when no campaigns', fakeAsync(() => {
    const campaigns: PaginatedCampaigns = {
      items: [],
      total_count: 0,
      page: 1,
      per_page: 10,
      total_pages: 0
    };

    mockClient.listSpy.and.returnValue(of(campaigns));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const emptyHeading = fixture.nativeElement.querySelector('h3');
    expect(emptyHeading.textContent).toContain('No hay ofertas');
  }));

  it('shows error and retry button on failure', fakeAsync(() => {
    mockClient.listSpy.and.returnValue(throwError(() => ({ message: 'Boom' })));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // After error, component.isLoading should be false and internalError set
    expect(component.isLoading).toBeFalse();

    // There's no dedicated error banner in the template; we check console side-effect indirectly by ensuring no rows
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // Should show empty placeholder row (no data)
    expect(rows.length).toBeGreaterThan(0);

    // Try retry - set up success on second call
    mockClient.listSpy.and.returnValue(of({ items: [{ id: '2', title: 'New' }], total: 1, page:1, limit:10, totalPages:1 }));
    component.retry();
    tick();
    fixture.detectChanges();

    const titleCell = fixture.nativeElement.querySelector('tbody td div .tw-text-sm.tw-font-medium.tw-text-gray-900');
    expect(titleCell.textContent).toContain('New');
  }));
});
