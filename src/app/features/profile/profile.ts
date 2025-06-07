import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {Store} from '@ngrx/store';
import {HeaderService} from '@app/header/header.service';
import {HeaderType} from '@shared/constants/header-type';
import {SessionData, SessionState} from '@app/core/store/session/session.state';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  animations: [],
  providers: [BackboneJwtPipe]
})

export class Profile implements OnInit {
  private readonly headerService: HeaderService = inject(HeaderService);
  private readonly changeDetectorRefs = inject(ChangeDetectorRef);
  private readonly store: Store<{ session: SessionState }> = inject(Store);

  protected sessionData: SessionData | undefined;
  protected isAuthenticated = false;
  protected userFullName: string | undefined;

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

  constructor() {}

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
      if (this.sessionData && this.sessionData.userAuth?.fullName) {
        this.isAuthenticated = true;
        this.userFullName = this.sessionData.userAuth.fullName;
        // Usar datos reales si están disponibles
        this.profileData.displayName = this.sessionData.userAuth.fullName;
        this.profileData.email = this.sessionData.userAuth.email || this.profileData.email;
      } else {
        this.isAuthenticated = false;
        this.userFullName = undefined;
      }
      // Log de la información de usuario disponible
      console.log('User session data:', this.sessionData);
      console.log('Profile data:', this.profileData);
    });
    this.processSessionData();
  }

  private processSessionData(): void  {
    if (this.sessionData?.token) {
      this.headerService.setHeaderType(HeaderType.USER_AUTH_HEADER);
    } else {
      this.headerService.setHeaderType(HeaderType.GENERAL_HEADER);
    }
    this.changeDetectorRefs.detectChanges();
  }

  // Getter para obtener las iniciales o avatar
  protected getAvatarDisplay(): string {
    if (this.profileData.avatar) {
      return this.profileData.avatar;
    }
    const firstInitial = this.profileData.firstName?.charAt(0) || '';
    const lastInitial = this.profileData.lastName?.charAt(0) || '';
    return firstInitial + lastInitial;
  }

  // Verificar si tiene avatar
  protected hasAvatar(): boolean {
    return this.profileData.avatar !== null && this.profileData.avatar !== '';
  }
}
