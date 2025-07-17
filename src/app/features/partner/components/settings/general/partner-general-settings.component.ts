import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, CardComponent, Avatar, InputComponent } from '@app/components/ui';
import { TextareaComponent } from '@app/components/ui/inputs/textarea';
import { SelectComponent } from '@app/components/ui/inputs/select';
import { IconComponent } from '@app/components/ui/icons/icon';
import { ReportProblem, ReportProblemOptions } from '@app/layout/report-problem/report-problem';


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

  categories = [
    // Comercio y Retail (más común)
    { value: 'restaurant', label: 'Restaurante' },
    { value: 'grocery', label: 'Supermercado/Bodega' },
    { value: 'convenience', label: 'Tienda de Conveniencia' },
    { value: 'clothing', label: 'Ropa y Accesorios' },
    { value: 'pharmacy', label: 'Farmacia' },
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'beauty', label: 'Belleza y Cuidado Personal' },
    { value: 'home', label: 'Hogar y Jardín' },
    { value: 'automotive', label: 'Automotriz' },
    { value: 'sports', label: 'Deportes y Recreación' },
    // Servicios (muy común en comunidad latina)
    { value: 'construction', label: 'Construcción' },
    { value: 'cleaning', label: 'Servicios de Limpieza' },
    { value: 'landscaping', label: 'Jardinería y Paisajismo' },
    { value: 'maintenance', label: 'Mantenimiento y Reparaciones' },
    { value: 'transportation', label: 'Transporte' },
    { value: 'catering', label: 'Catering y Eventos' },
    { value: 'childcare', label: 'Cuidado Infantil' },
    { value: 'eldercare', label: 'Cuidado de Adultos Mayores' },
    { value: 'translation', label: 'Traducción e Interpretación' },
    // Servicios Profesionales
    { value: 'legal', label: 'Servicios Legales' },
    { value: 'accounting', label: 'Contabilidad y Finanzas' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'realestate', label: 'Bienes Raíces' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'technology', label: 'Tecnología' },
    { value: 'marketing', label: 'Marketing y Publicidad' },
    // Salud y Bienestar
    { value: 'healthcare', label: 'Servicios de Salud' },
    { value: 'dental', label: 'Servicios Dentales' },
    { value: 'fitness', label: 'Fitness y Gimnasios' },
    { value: 'spa', label: 'Spa y Wellness' },
    // Entretenimiento y Cultura
    { value: 'entertainment', label: 'Entretenimiento' },
    { value: 'music', label: 'Música y Eventos' },
    { value: 'education', label: 'Educación y Capacitación' },
    { value: 'travel', label: 'Viajes y Turismo' },
    // Manufactura y Distribución
    { value: 'manufacturing', label: 'Manufactura' },
    { value: 'wholesale', label: 'Distribución/Mayoreo' },
    { value: 'import_export', label: 'Importación/Exportación' },
    { value: 'food_production', label: 'Producción de Alimentos' },
    // Tradicional/Especializado
    { value: 'bakery', label: 'Panadería' },
    { value: 'barber', label: 'Barbería/Peluquería' },
    { value: 'mechanic', label: 'Taller Mecánico' },
    { value: 'laundry', label: 'Lavandería' },
    { value: 'money_services', label: 'Servicios Financieros/Remesas' },
    // Otros
    { value: 'other', label: 'Otro' }
  ];

  timezones = [
    { value: 'PST', label: '(GMT -8:00) Hora del Pacífico (EE.UU. y Canadá)' },
    { value: 'CST', label: '(GMT -6:00) Hora Central (EE.UU. y Canadá), Ciudad de México' },
    { value: 'EST', label: '(GMT -5:00) Hora del Este (EE.UU. y Canadá), Bogotá, Lima' },
    { value: 'MST', label: '(GMT -7:00) Hora de la Montaña (EE.UU. y Canadá)' },
    { value: 'COT', label: '(GMT -5:00) Hora de Colombia' },
    { value: 'PET', label: '(GMT -5:00) Hora de Perú' },
    { value: 'ECT', label: '(GMT -5:00) Hora de Ecuador' },
    { value: 'VET', label: '(GMT -4:00) Hora de Venezuela' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder
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
    // Initialize form with partner data
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
}
