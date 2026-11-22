import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-code',
  imports: [TranslateModule],
  templateUrl: './verification-code.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './verification-code.component.css'
})
export class VerificationCodeComponent {

}
