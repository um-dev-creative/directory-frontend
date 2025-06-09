import {ChangeDetectorRef, Component, inject, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {Store} from '@ngrx/store';
import {HeaderService} from '@app/header/header.service';
import {HeaderType} from '@shared/constants/header-type';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import { Button, InputComponent, Avatar, CardComponent, ModalComponent } from '@app/components/ui';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from './services/user.service';
import { ReportProblem, ReportProblemOptions } from '@app/layout/report-problem/report-problem';

@Component({
  selector: 'app-community-member',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, InputComponent, Avatar, ReportProblem, CardComponent, ModalComponent],
  templateUrl: './community-member.html',
  animations: [],
  providers: [BackboneJwtPipe]
})

export class CommunityMember implements OnInit, OnDestroy {
  private readonly headerService: HeaderService = inject(HeaderService);
  private readonly changeDetectorRefs = inject(ChangeDetectorRef);
  private readonly store: Store<{ session: SessionState }> = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private destroy$ = new Subject<void>();

  protected sessionData: SessionData | undefined;
  protected isAuthenticated = false;
  protected userFullName: string | undefined;
  protected profileForm!: FormGroup;
  protected isSubmitting = false;
  protected uploadingAvatar = false;
  protected avatarPreview: string | null = null;
  protected deleteAccountModalOpen = false;

  // Opciones para el componente ReportProblem
  protected reportProblemOptions: ReportProblemOptions = {};

  // Mock data para el perfil
  protected profileData = {
    email: 'omairys.15@gmail.com',
    firstName: 'Omairys',
    lastName: 'Uzcátegui',
    displayName: 'Omairys',
    phone: '(416) 858-0276',
    birthDate: {
      month: 'February',
      day: '06',
      year: '1987'
    },
    // avatar: null,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', // URL de un avatar de ejemplo
    emailConfirmed: true,
    privacyOptOut: false,
    notifications: {
      email: true,
      sms: false
    }
  };

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      email: [{value: this.profileData.email, disabled: true}, [Validators.required, Validators.email]],
      firstName: [this.profileData.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.profileData.lastName, [Validators.required, Validators.minLength(2)]],
      displayName: [this.profileData.displayName, [Validators.required, Validators.minLength(2)]],
      phone: [this.profileData.phone],
      birthDate: [{value: `${this.profileData.birthDate.day}/${this.profileData.birthDate.month}/${this.profileData.birthDate.year}`, disabled: true}],
      notificationsEmail: [this.profileData.notifications.email],
      notificationsSms: [this.profileData.notifications.sms],
      privacyOptOut: [this.profileData.privacyOptOut]
    });
  }

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      if (this.sessionData && this.sessionData.userAuth?.fullName) {
        this.isAuthenticated = true;
        this.userFullName = this.sessionData.userAuth.fullName;
        // Usar datos reales si están disponibles
        this.profileData.displayName = this.sessionData.userAuth.fullName;
        this.profileData.email = this.sessionData.userAuth.email || this.profileData.email;
        // Actualizar el formulario con los nuevos datos
        this.updateFormWithSessionData();
      } else {
        this.isAuthenticated = false;
        this.userFullName = undefined;
      }
      // Log de la información de usuario disponible
      console.log('User session data:', this.sessionData);
      console.log('Profile data:', this.profileData);

      // Actualizar opciones del componente ReportProblem
      this.updateReportProblemOptions();
    });
    this.processSessionData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFormWithSessionData(): void {
    this.profileForm.patchValue({
      email: this.profileData.email,
      displayName: this.profileData.displayName
    });
  }

  private updateReportProblemOptions(): void {
    this.reportProblemOptions = {
      userEmail: this.profileData.email,
      userDisplayName: this.profileData.displayName,
      contextData: {
        formStatus: this.profileForm?.valid ? 'valid' : 'invalid',
        hasAvatar: this.hasAvatar(),
        isAuthenticated: this.isAuthenticated
      },
      // Puedes personalizar la URL del Google Form aquí
      googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd8_swniU29cO1Q8igw6F1H0-DrhJj6ah5nfdfE_zUkWWepMA/viewform?usp=pp_url&entry.915825717=CommunityMemberProfile'
    };
  }

  private processSessionData(): void  {
    if (this.sessionData?.token) {
      this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

  // Getter para obtener las iniciales
  protected getAvatarDisplay(): string {
    const firstInitial = this.profileData.firstName?.charAt(0) || '';
    const lastInitial = this.profileData.lastName?.charAt(0) || '';
    return firstInitial + lastInitial;
  }

  // Verificar si tiene avatar
  protected hasAvatar(): boolean {
    return !!(this.profileData.avatar && this.profileData.avatar.trim() !== '');
  }

  // Avatar upload functionality
  onAvatarSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.uploadingAvatar = true;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Upload file
      this.userService.uploadAvatar(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.profileData.avatar = response.url;
            this.uploadingAvatar = false;
          },
          error: (error: any) => {
            console.error('Error uploading avatar:', error);
            this.uploadingAvatar = false;
          }
        });
    }
  }

  // Métodos para el formulario reactivo
  protected getFieldVariant(fieldName: string): 'default' | 'error' {
    const field = this.profileForm.get(fieldName);
    return field && field.invalid && (field.dirty || field.touched) ? 'error' : 'default';
  }

  protected getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['email']) {
        return 'Formato de email inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  protected onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      console.log('Form submitted:', this.profileForm.value);

      // Simular llamada a API
      setTimeout(() => {
        this.isSubmitting = false;
        console.log('Profile updated successfully');
      }, 2000);
    } else {
      console.log('Form is invalid');
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  protected deleteAccount(): void {
    this.deleteAccountModalOpen = true;
  }

  protected confirmDeleteAccount(): void {
    console.log('Account deletion confirmed');
    // Aquí puedes agregar la lógica para eliminar la cuenta
    // Por ejemplo, llamar a un servicio para eliminar la cuenta del usuario

    // Simular llamada a API
    setTimeout(() => {
      console.log('Account deleted successfully');
      this.deleteAccountModalOpen = false;
      // Redirigir al usuario o mostrar mensaje de confirmación
    }, 1000);
  }

  protected cancelDeleteAccount(): void {
    this.deleteAccountModalOpen = false;
  }

  protected getFormValues(): string {
    return JSON.stringify(this.profileForm.value, null, 2);
  }

  protected getFormErrors(): string {
    const errors: any = {};
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return JSON.stringify(errors, null, 2);
  }
}
