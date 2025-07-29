import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, CardComponent, Avatar, InputComponent } from '@app/components/ui';
import { TextareaComponent } from '@app/components/ui/inputs/textarea';
import { SelectComponent } from '@app/components/ui/inputs/select';
import { IconComponent } from '@app/components/ui/icons/icon';
import { ReportProblem, ReportProblemOptions } from '@app/layout/report-problem/report-problem';
import {
  PartnerCategoryService,
  PartnerCategory,
  TimezoneService,
  Timezone
} from '@app/core/services';
import {CategoryClient} from '@core/services/category/category-client.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';


interface PartnerGeneralData {
  partnerName: string;
  partnerVerification?: boolean;
  slug: string;
  partnerDescription: string;
  partnerImage: string;
  customerServiceEmail: string;
  orderManagementEmail: string;
  category: string;
  timezone: string;
}

@Component({
  selector: 'app-partner-general-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, CardComponent, Avatar, InputComponent, TextareaComponent, SelectComponent, IconComponent, ReportProblem],
  templateUrl: './partner-general-settings.component.html',
  styleUrls: ['./partner-general-settings.component.css']
})
export class PartnerGeneralSettingsComponent implements OnInit {
  generalForm: FormGroup;
  isSubmitting = false;
  uploadingImage = false;
  imagePreview: string | null = null;
  categories: PartnerCategory[] = [];
  loadingCategories = false;
  timezones: Timezone[] = [];
  loadingTimezones = false;
  private readonly destroy$ = new Subject<void>();

  reportProblemOptions: ReportProblemOptions = {
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=BusinessGeneralSettings',
    contextData: {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      currentPath: '/partner/settings/general',
      component: 'PartnerGeneralSettings'
    }
  };

  partnerData: PartnerGeneralData = {
    partnerName: 'Kwik-E-Mart',
    partnerVerification: false,
    slug: 'nike',
    partnerDescription: 'Tienda de Conveniencia',
    partnerImage: '',
    customerServiceEmail: 'servicio@ejemplo.com',
    orderManagementEmail: 'manager@ejemplo.com',
    category: 'restaurant',
    timezone: 'EST'
  };

  private readonly categoryClient: CategoryClient  = inject(CategoryClient);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private partnerCategoryService: PartnerCategoryService,
    private timezoneService: TimezoneService
  ) {
    this.generalForm = this.fb.group({
      partnerName: [this.partnerData.partnerName, [Validators.required, Validators.maxLength(25)]],
      partnerDescription: [this.partnerData.partnerDescription, [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      customerServiceEmail: [this.partnerData.customerServiceEmail, [Validators.required, Validators.email]],
      orderManagementEmail: [this.partnerData.orderManagementEmail, [Validators.required, Validators.email]],
      category: [this.partnerData.category, [Validators.required]],
      timezone: [this.partnerData.timezone, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTimezones();
  }

  private loadCategories(): void {
    this.loadingCategories = true;
    this.categoryClient.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (getCategoryResponse) => {
        if(getCategoryResponse.headers.status === 200 && getCategoryResponse.data.length > 0) {
          this.categories = getCategoryResponse.data
            .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
            .map((category: any) => ({value: category.id, label: category.name}));
        }
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loadingCategories = false;
      }
    });
  }

  private loadTimezones(): void {
    this.loadingTimezones = true;
    this.timezoneService.getTimezones().subscribe({
      next: (timezones) => {
        this.timezones = timezones;
        this.loadingTimezones = false;
      },
      error: (error) => {
        console.error('Error loading timezones:', error);
        this.loadingTimezones = false;
        // Fallback: podrías mostrar un mensaje de error al usuario
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
    if (this.generalForm.valid) {
      this.isSubmitting = true;

      const formData = {
        ...this.generalForm.value
      };

      // Simulate API call
      setTimeout(() => {
        console.log('Saving partner general settings:', formData);
        this.isSubmitting = false;
        // Show success message
      }, 2000);
    }
  }

  getFieldVariant(fieldName: string): 'default' | 'error' {
    const field = this.generalForm.get(fieldName);
    return field && field.invalid && (field.dirty || field.touched) ? 'error' : 'default';
  }

  getFieldError(fieldName: string): string {
    const field = this.generalForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Ingresa un email válido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }

  viewPartner(): void {
    // Navigate to partner view using slug
    if (this.partnerData.slug) {
      this.router.navigate(['/partner', this.partnerData.slug]);
    } else {
      console.error('No slug available for partner navigation');
    }
  }

  getFormValues(): string {
    return JSON.stringify(this.generalForm.value, null, 2);
  }

  getFormErrors(): string {
    const errors: any = {};
    Object.keys(this.generalForm.controls).forEach(key => {
      const control = this.generalForm.get(key);
      if (control && control.errors) {
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

    // Fallback to first two characters if no meaningful words found
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
        console.error('Error searching categories:', error);
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
        console.error('Error searching timezones:', error);
        this.loadingTimezones = false;
      }
    });
  }
}
