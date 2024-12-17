import {Component} from '@angular/core'
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: 'footer.html',
  styleUrl: 'footer.css',
  standalone: true
})
export class Footer {
  public autor: any = {nombre: 'Luis', apellido: 'Mata', company: 'PRX  Innovative'};
}
