import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SessionData, SessionState} from '@app/core/store/session/session.state';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {LoadingService} from '@app/core/services/loading.service';
import {BackboneJwtPipe} from '@shared/pipes/backbone-jwt.pipe';
import {NotificationService} from '@app/core/services/notification.service';
import {loadSession} from '@app/core/store/session/session.action';
import {HeaderType} from '@shared/constants/header-type';
import {HeaderService} from '@app/header/header.service';
import {VerifyCodeClient} from '@app/verify-code/verify-code-client.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {SessionStoreService} from '@app/core/store/session/session-store.service';
import {DFC} from '@shared/constants/app.const';
import {Router} from '@angular/router';
import {LoggerService} from '@app/core/services/logger.service';

@Component({
  selector: 'app-verify-code',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './verify-code.html',
  styleUrl: './verify-code.css'
})
export class VerifyCode implements OnDestroy, OnInit, AfterViewInit {

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
   * @type {BackboneJwtPipe}
   */
  protected readonly jwtPipe: BackboneJwtPipe = inject(BackboneJwtPipe);

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

  private readonly userRegisterClient: VerifyCodeClient = inject(VerifyCodeClient);

  /**
   * Flag to indicate if an error was found
   * @type {boolean}
   */
  protected isErrorFound: boolean = false;

  private readonly logger = inject(LoggerService);

  protected verificationCodeForm: FormGroup;

  /**
   * Notification service for showing messages
   * @type {NotificationService}
   */
  private readonly notificationService: NotificationService = inject(NotificationService);

  private readonly sessionStoreService: SessionStoreService = inject(SessionStoreService);

  /**
   * Router services for navigation
   * @param {Router}
   */
  private readonly router: Router = inject(Router);


  constructor() {
    // no local console wrappers; use injected logger
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
    let uuid = null;

    if (this.sessionData) {
      sessionTokenBkd = this.sessionData.userAuth?.sessionTokenBkd;
      uuid = this.jwtPipe.transform(sessionTokenBkd)?.uid ?? '';
      //
    }
    const userRegisterRequest = {
      userId: uuid,
      verificationCode: this.getCodeFormat()
    };

    this.loader.show();
    this.userRegisterClient.confirmCode(userRegisterRequest).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response) => {
          this.notificationService.success('Success');
          this.router.navigate([DFC.RelativePath.STAGE_PATH]);
          // }
          this.loader.hide();
        },
        error: (error) => {
          this.notificationService.warning('Invalid code.');
          this.loader.hide();
        }
      });
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
      this.logger.error(`Error occurred while getting ${element}`, {status: errorResponse.status, statusText: errorResponse.statusText});
    } else {
      this.logger.error(`Error occurred while getting ${element}`, errorResponse);
    }
  }

  onInput(event: Event, next: HTMLElement | null): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && next && 'focus' in next) {
      (next as HTMLInputElement).focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replaceAll('-', '').slice(0, 8).split('');
    const controls = ['position1', 'position2', 'position3', 'position4', 'position5', 'position6', 'position7', 'position8'];
    controls.forEach((ctrl, i) => {
      this.verificationCodeForm.get(ctrl)?.setValue(digits[i] ?? '');
    });
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
