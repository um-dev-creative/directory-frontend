import {Component} from '@angular/core'
import {CommonModule} from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, CommonModule],
  templateUrl: 'footer.html',
  styleUrl: 'footer.css',
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
