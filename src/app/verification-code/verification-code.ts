import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SessionData, SessionState} from '@app/shared/signals/session/session.state';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {LoadingService} from '@shared/services/loading.service';
import {JwtPipe} from '@shared/services/jwt.pipe';
import {AlertService} from '@shared/services/alert.service';
import {loadSession} from '@shared/signals/session/session.action';
import {HeaderType} from '@shared/constants/header-type';
import {HeaderService} from '@app/header/header.service';
import {UserRegisterClient} from '@app/user-register/user-register.client';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {SessionStoreService} from '@shared/signals/session/session-store.service';

@Component({
  selector: 'app-verification-code',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './verification-code.html',
  styleUrl: './verification-code.css'
})
export class VerificationCode implements OnDestroy, OnInit, AfterViewInit {

  /**
   * Subject for unsubscribing from observables
   * @type {Subject<void>}
   */
  private readonly subject$: Subject<void> = new Subject<void>();

  /**
   * Store services for session data management
   * @type {Store<{ session: SessionData }>}
   */
  private readonly store: Store<{ session: SessionState }> = inject(Store);

  /**
   * Loading services
   * @type {LoadingService}
   */
  protected loader: LoadingService = inject(LoadingService)


  /**
   * Change detector reference
   * @type {ChangeDetectorRef}
   */
  protected changeDetectorRefs: ChangeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Jwt pipe
   * @type {JwtPipe}
   */
  protected readonly jwtPipe: JwtPipe = inject(JwtPipe);

  /**
   * Session data
   * @type {SessionData | undefined}
   */
  protected sessionData: SessionData | undefined;

  /**
   * Header services for changing the header type
   * @type {HeaderService}
   */
  private readonly headerService: HeaderService = inject(HeaderService);

  private readonly userRegisterClient: UserRegisterClient = inject(UserRegisterClient);

  /**
   * Flag to indicate if an error was found
   * @type {boolean}
   */
  protected isErrorFound: boolean = false;

  /** Function to log information */
  protected logInfo: (...arg: any) => void;

  /** Function to log errors */
  protected logError: (...arg: any) => void;

  protected verificationCodeForm: FormGroup;

  /**
   * Alert services
   * @type {AlertService}
   */
  private readonly alertService: AlertService = inject(AlertService);

  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);


  constructor() {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
    this.verificationCodeForm = new FormGroup({
      position1: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      position2: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      position3: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      position4: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      position5: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      position6: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      position7: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      position8: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
    });
  }

  ngOnInit(): void {
    this.store.select('session').subscribe(sessionState => {
      this.sessionData = sessionState.sessionData;
    });
    this.headerService.setHeaderType(HeaderType.CENTER_HEADER);
  }

  ngAfterViewInit(): void {
    this.store.dispatch(loadSession());
    this.changeDetectorRefs.detectChanges();
  }

  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  confirmVerificationCode(): void {
    let sessionToken = null;
    let sessionTokenBkd = null;
    const userRegisterRequest = {
      userId: '9c5758ec-cf62-4c50-a8d4-e41e493f2415',
      verificationCode: this.getCodeFormat()
    };

    if(this.sessionData){
      sessionToken = this.sessionData.userAuth?.sessionToken;
      sessionTokenBkd = this.sessionData.userAuth?.sessionTokenBkd;

    }
    this.loader.show();
    if (sessionToken && sessionTokenBkd) {
      this.userRegisterClient.confirmCode(userRegisterRequest, sessionToken, sessionTokenBkd).pipe(takeUntil(this.subject$))
        .subscribe({
          next: (response) => {
            if (response.status === 202) {
              this.alertService.success('Success', true);
            }
            this.loader.hide();
          },
          error: (error) => {
            this.setErrorFound('verification-code', error);
            this.alertService.error('Error', true);
            this.loader.hide();
          }
        });
    }
  }

  /**
   * Set the error found.
   * It sets the error found to true and logs the error.
   *
   * @method
   * @param element - The element to set the error found.
   * @param errorResponse - The error response to log.
   * @since 1.0.0
   * @version 1.0.0
   */
  setErrorFound(element: string, errorResponse: Error): void {
    this.isErrorFound = true;
    if (errorResponse instanceof HttpErrorResponse) {
      this.logError(`Error occurred while getting ${element} ${errorResponse.status}: ${errorResponse.statusText}`);
    } else {
      this.logError(`Error occurred while getting ${element} ${errorResponse}`);
    }
  }

  private getCodeFormat() {
    return this.verificationCodeForm.get('position1')?.value +
      this.verificationCodeForm.get('position2')?.value +
      this.verificationCodeForm.get('position3')?.value +
      this.verificationCodeForm.get('position4')?.value + "-" +
      this.verificationCodeForm.get('position5')?.value +
      this.verificationCodeForm.get('position6')?.value +
      this.verificationCodeForm.get('position7')?.value +
      this.verificationCodeForm.get('position8')?.value;
  }

}
