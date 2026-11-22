import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '@app/components/ui';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [TranslateModule, CommonModule, RouterModule, Button],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    window.location.href = '/';
  }
}
