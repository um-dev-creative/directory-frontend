import {Component, ChangeDetectionStrategy} from '@angular/core'

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule],
  templateUrl: 'footer.html',
  styleUrl: 'footer.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class Footer {
  public autor: any = {
    nombre: 'Luis', 
    apellido: 'Mata', 
    company: 'UM Dev Creative',
    year: new Date().getFullYear()
  };
}
