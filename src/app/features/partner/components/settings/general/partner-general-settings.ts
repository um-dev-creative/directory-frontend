import {Component, inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Avatar, Button, CardComponent, InputComponent} from '@app/components/ui';
import {TextareaComponent} from '@app/components/ui/inputs/textarea';
import {SelectComponent} from '@app/components/ui/inputs/select';
import {IconComponent} from '@app/components/ui/icons/icon';
import {ReportProblem, ReportProblemOptions} from '@app/layout/report-problem/report-problem';
import {NotificationService, PartnerCategoryService, TimezoneService} from '@app/core/services';
import {CategoryClient} from '@core/services/category/category.client';
import {BusinessClient} from '@app/core/services/business/business.client';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SessionData, SessionState} from '@core/store/session/session.state';
import {Store} from '@ngrx/store';
import {LoggerService} from '@app/core/services/logger.service';
import {TimezoneClient} from '@core/services/timezone/timezone.client';


interface PartnerGeneralData {
  partnerName: string;
  partnerVerification?: boolean;
  slug: string;
  website: string;
  partnerDescription: string;
  partnerImage: string;
  email: string;
  customerServiceEmail: string;
  orderManagementEmail: string;
  category: string;
  timezone: string;
}

@Component({
  selector: 'app-partner-general-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, CardComponent, Avatar, InputComponent, TextareaComponent, SelectComponent, IconComponent, ReportProblem],
  templateUrl: './partner-general-settings.html',
  styleUrls: ['./partner-general-settings.css']
})
export class PartnerGeneralSettings implements OnInit, OnDestroy {
  generalForm: FormGroup;
  isSubmitting = false;
  uploadingImage = false;
  imagePreview: string | null = null;
  // categories: PartnerCategory[] = [];
  categories: { value: string; label: string }[] = [];
  timezones: { value: string; label: string }[] = [];
  loadingCategories = false;
  // timezones: Timezone[] = [];
  /** * Indicates if timezones are currently being loaded */
  loadingTimezones = false;
  /** * Unique identifier for the business, replace with actual business ID */
  private readonly destroy$ = new Subject<void>();
  /** Session data from the store */
  protected sessionData: SessionData | undefined;

  reportProblemOptions: ReportProblemOptions = {
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=BusinessGeneralSettings',
    contextData: {
      timestamp: new Date().toISOString(),
      userAgent: '',
      currentPath: '/partner/settings/general',
      component: 'PartnerGeneralSettings'
    }
  };

  partnerData: PartnerGeneralData = {
    partnerName: 'Kwik-E-Mart',
    partnerVerification: false,
    slug: 'nike',
    website: 'https://www.ejemplo.com',
    partnerDescription: 'Tienda de Conveniencia',
    partnerImage: '',
    email: '',
    customerServiceEmail: 'servicio@ejemplo.com',
    orderManagementEmail: 'manager@ejemplo.com',
    category: 'restaurant',
    timezone: 'EST'
  };

  loadingBusinessDetails = false;
  errorLoadingBusinessDetails = false;

  /** Store for session state */
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly categoryClient: CategoryClient = inject(CategoryClient);
  private readonly timezoneClient: TimezoneClient = inject(TimezoneClient);
  private readonly partnerCategoryService: PartnerCategoryService = inject(PartnerCategoryService);
  private readonly timezoneService: TimezoneService = inject(TimezoneService);
  private readonly businessClient: BusinessClient = inject(BusinessClient);
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly router: Router = inject(Router);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly logger = inject(LoggerService);
  /** Service for displaying notifications */
  private readonly notificationService: NotificationService = inject(NotificationService);


  constructor() {
    if (isPlatformBrowser(this.platformId)) { // SSR: browser-only
      this.reportProblemOptions.contextData = {
        ...this.reportProblemOptions.contextData,
        userAgent: navigator.userAgent
      };
    }

    this.generalForm = this.fb.group({
      partnerName: [this.partnerData.partnerName, [Validators.required, Validators.maxLength(25)]],
      partnerDescription: [this.partnerData.partnerDescription, [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      customerServiceEmail: [this.partnerData.customerServiceEmail, [Validators.required, Validators.email]],
      orderManagementEmail: [this.partnerData.orderManagementEmail, [Validators.required, Validators.email]],
      category: [this.partnerData.category, [Validators.required]],
      timezone: [this.partnerData.timezone, [Validators.required]]
    });
    this.logger.info('PartnerGeneralSettings initialized with form:', this.generalForm.value);
  }

  ngOnInit(): void {
    this.store.select('session').pipe(takeUntil(this.destroy$)).subscribe(sessionState => {
      if (sessionState?.sessionData) {
        this.sessionData = sessionState.sessionData;
        this.partnerData.email = sessionState.sessionData.userAuth.email || '';
        // Aquí podrías cargar más datos del negocio si es necesario
      }
    });
    this.logger.debug('PartnerGeneralSettings ngOnInit - sessionData:', this.sessionData);
    this.loadCategories();
    this.loadTimezones();
    const businessId = this.getCurrentBusinessId();
    if (businessId) {
      this.loadBusinessDetails(businessId);
    }
    this.logger.debug('PartnerGeneralSettings ngOnInit - business details loaded for:', this.sessionData?.userAuth.businesses[0]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadCategories(): void {
    this.loadingCategories = true;
    this.categoryClient.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (getCategoryResponse) => {
        if (getCategoryResponse.headers.status === 200 && getCategoryResponse.data.length > 0) {
          this.categories = getCategoryResponse.data
            .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
            .map((category: any) => ({value: category.id, label: category.name}));
        }
        this.loadingCategories = false;
      },
      error: (err) => {
        this.logger.error('Error loading categories:', err);
        this.loadingCategories = false;
      }
    });
  }

  private loadTimezones(): void {
    this.loadingTimezones = true;
    this.timezoneClient.getTimezones().pipe(takeUntil(this.destroy$)).subscribe({
      next: (timezonesResponse) => {
        if (timezonesResponse.headers.status === 200 && timezonesResponse.data.total > 0) {
          this.timezones = timezonesResponse.data.timezones.sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name))
            .map((timezone: any) => ({value: timezone.id, label: timezone.name}));
        }
        this.loadingTimezones = false;
      },
      error: (error) => {
        this.logger.error('Error loading timezones:', error);
        this.loadingTimezones = false;
        // Fallback: podrías mostrar un mensaje de error al usuario
      }
    });
  }

  loadBusinessDetails(businessId: string): void {
    this.loadingBusinessDetails = true;
    this.errorLoadingBusinessDetails = false;

    this.businessClient.getBusinessById(businessId).subscribe({
      next: (businessDetailResponse) => {
        if (businessDetailResponse?.headers.status === 200) {
          this.partnerData.partnerName = businessDetailResponse.data.name;
          this.partnerData.partnerDescription = businessDetailResponse.data.description;
          this.partnerData.customerServiceEmail = businessDetailResponse.data.customerServiceEmail || '';
          this.partnerData.orderManagementEmail = businessDetailResponse.data.orderManagementEmail || '';
          this.partnerData.website = businessDetailResponse.data.website || '';
          this.partnerData.category = businessDetailResponse.data.categoryId || '';
          this.partnerData.timezone = businessDetailResponse.data.timezoneId || 'UTC'; // Default to UTC if not set
          this.partnerData.partnerVerification = businessDetailResponse.data.verified || false;
          this.generalForm.patchValue({
            partnerName: this.partnerData.partnerName,
            partnerDescription: this.partnerData.partnerDescription,
            customerServiceEmail: this.partnerData.customerServiceEmail,
            orderManagementEmail: this.partnerData.orderManagementEmail,
            category: this.partnerData.category,
            timezone: this.partnerData.timezone
          });
          this.logger.info('Business details loaded successfully:', this.partnerData);
        } else {
          this.logger.error('Failed to load business details:', businessDetailResponse);
        }
        this.loadingBusinessDetails = false;
      },
      error: (error) => {
        this.logger.error('Error loading business details:', error);
        this.errorLoadingBusinessDetails = true;
        this.loadingBusinessDetails = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/partner/settings']);
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadingImage = true;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.uploadingImage = false;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.generalForm.valid || this.isSubmitting) {
      return;
    }

    const businessId = this.getCurrentBusinessId();
    if (!businessId) {
      this.logger.error('Unable to update business: businessId not found in session');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.generalForm.getRawValue();

    const payload = {
      name: formValue.partnerName,
      description: formValue.partnerDescription,
      categoryId: formValue.category,
      email: this.partnerData.email || this.sessionData?.userAuth.email || null,
      customerServiceEmail: formValue.customerServiceEmail,
      orderManagementEmail: formValue.orderManagementEmail,
      website: this.partnerData.website
    };

    this.businessClient.updateBusiness(businessId, payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.logger.info('Partner general settings updated successfully:', response?.updatedDate);
        this.generalForm.markAsPristine();
        this.notificationService.success('User updated successfully');
        this.isSubmitting = false;
      },
      error: (error) => {
        this.logger.error('Error updating partner general settings:', error);
        this.isSubmitting = false;
      }
    });
  }

  getFieldVariant(fieldName: string): 'default' | 'error' {
    const field = this.generalForm.get(fieldName);
    return field && field.invalid && (field.dirty || field.touched) ? 'error' : 'default';
  }

  getFieldError(fieldName: string): string {
    const field = this.generalForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Ingresa un email válido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  viewPartner(): void {
    // Navigate to the partner view using slug
    if (this.partnerData.slug) {
      this.router.navigate(['/partner', this.partnerData.slug]);
    } else {
      this.logger.error('No slug available for partner navigation');
    }
  }

  getFormValues(): string {
    return JSON.stringify(this.generalForm.value, null, 2);
  }

  getFormErrors(): string {
    const errors: any = {};
    Object.keys(this.generalForm.controls).forEach(key => {
      const control = this.generalForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return JSON.stringify(errors, null, 2);
  }

  getAvatarDisplay(): string {
    const partnerName = this.generalForm.get('partnerName')?.value || this.partnerData.partnerName;
    if (!partnerName) return 'PN';

    // Remove common words and get meaningful initials
    const words = partnerName.split(' ').filter((word: string) =>
      !['de', 'del', 'la', 'el', 'y', 'e', 'o', 'u', 'a', 'an', 'and', 'the', 'of'].includes(word.toLowerCase())
    );

    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    // Fallback to the first two characters if no meaningful words found
    return partnerName.substring(0, 2).toUpperCase();
  }

  /**
   * Busca categorías basado en un término de búsqueda
   * @param searchTerm Término de búsqueda
   */
  searchCategories(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim().length === 0) {
      this.loadCategories();
      return;
    }

    this.loadingCategories = true;
    this.partnerCategoryService.searchCategories(searchTerm).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (error) => {
        this.logger.error('Error searching categories:', error);
        this.loadingCategories = false;
      }
    });
  }

  /**
   * Busca zonas horarias basado en un término de búsqueda
   * @param searchTerm Término de búsqueda
   */
  searchTimezones(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim().length === 0) {
      this.loadTimezones();
      return;
    }

    this.loadingTimezones = true;
    this.timezoneService.searchTimezones(searchTerm).subscribe({
      next: (timezones) => {
        this.timezones = timezones;
        this.loadingTimezones = false;
      },
      error: (error) => {
        this.logger.error('Error searching timezones:', error);
        this.loadingTimezones = false;
      }
    });
  }

  private getCurrentBusinessId(): string | null {
    return this.sessionData?.userAuth?.businesses?.[0] ?? null;
  }
}
