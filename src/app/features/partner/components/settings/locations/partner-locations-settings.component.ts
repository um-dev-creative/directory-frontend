import {Component, effect, inject, OnInit, PLATFORM_ID, signal, ChangeDetectionStrategy} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {SessionState} from '@app/core/store/session/session.state';
import {LocationsStoreService} from '@core/store/locations/locations-store.service';
import {BusinessSearchStoreService} from '@core/store/business-search/business-search-store.service';
import {Location, LocationCreateRequest} from '@shared/models/location.model';

/** The address must have text, not only spaces. */
function notBlank(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim().length === 0 ? {blank: true} : null;
}

/**
 * Locations (sedes) of the business of the signed-in owner: list, add, edit, make main and delete.
 * The backend decides who is the owner (403 otherwise) and keeps exactly one main location.
 */
@Component({
  selector: 'app-partner-locations-settings',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './partner-locations-settings.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './partner-locations-settings.component.css'
})
export class PartnerLocationsSettingsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly locationsStore = inject(LocationsStoreService);
  private readonly searchStore = inject(BusinessSearchStoreService);
  private readonly platformId = inject(PLATFORM_ID);

  /** The business the owner manages: the first one of the session. */
  protected readonly businessId = toSignal(
    this.store.select((state) => state.session?.sessionData?.userAuth?.businesses?.[0] ?? null), {initialValue: null});
  protected readonly locations = toSignal(this.locationsStore.locations$, {initialValue: []});
  protected readonly isLoading = toSignal(this.locationsStore.isLoading$, {initialValue: false});
  protected readonly isSaving = toSignal(this.locationsStore.isSaving$, {initialValue: false});
  protected readonly error = toSignal(this.locationsStore.error$, {initialValue: null});
  protected readonly cities = toSignal(this.searchStore.cities$, {initialValue: []});

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly pendingDeleteId = signal<string | null>(null);
  private readonly submitted = signal(false);
  private readonly sawSaving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    cityId: ['', Validators.required],
    name: ['', Validators.maxLength(120)],
    addressLine: ['', [Validators.required, notBlank, Validators.maxLength(200)]],
    postalCode: ['', Validators.maxLength(10)],
    phone: ['', Validators.maxLength(30)],
    main: [false]
  });

  constructor() {
    // SSR: browser-only. The locations are read through the BFF with the browser's session.
    effect(() => {
      const businessId = this.businessId();
      if (businessId && isPlatformBrowser(this.platformId)) {
        this.locationsStore.load(businessId);
      }
    });
    // The form closes when the save that was started from it finishes without an error; with an error it stays open.
    effect(() => {
      const saving = this.isSaving();
      if (saving) {
        this.sawSaving.set(true);
      } else if (this.sawSaving() && this.submitted()) {
        this.sawSaving.set(false);
        this.submitted.set(false);
        if (!this.error()) {
          this.closeForm();
        }
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.cities().length === 0) {
      this.searchStore.loadCities();
    }
  }

  goBack(): void {
    void this.router.navigate(['/partner/settings']);
  }

  protected openAdd(): void {
    this.editingId.set(null);
    this.form.reset({cityId: '', name: '', addressLine: '', postalCode: '', phone: '', main: false});
    this.showForm.set(true);
  }

  protected openEdit(location: Location): void {
    this.editingId.set(location.id);
    this.form.reset({
      cityId: location.city.id,
      name: location.name ?? '',
      addressLine: location.addressLine,
      postalCode: location.postalCode ?? '',
      phone: location.phone ?? '',
      main: location.main
    });
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  protected submit(): void {
    const businessId = this.businessId();
    if (!businessId) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const request: LocationCreateRequest = {
      cityId: value.cityId,
      name: value.name,
      addressLine: value.addressLine,
      postalCode: value.postalCode,
      phone: value.phone,
      main: value.main
    };
    const editingId = this.editingId();
    this.submitted.set(true);
    if (editingId) {
      this.locationsStore.update(businessId, editingId, request);
    } else {
      this.locationsStore.create(businessId, request);
    }
  }

  protected makeMain(location: Location): void {
    const businessId = this.businessId();
    if (businessId && !location.main) {
      this.locationsStore.update(businessId, location.id, {main: true});
    }
  }

  protected askDelete(location: Location): void {
    this.pendingDeleteId.set(location.id);
  }

  protected cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  protected confirmDelete(location: Location): void {
    const businessId = this.businessId();
    if (businessId) {
      this.locationsStore.remove(businessId, location.id);
    }
    this.pendingDeleteId.set(null);
  }
}
