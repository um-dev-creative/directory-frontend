import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Banner} from '@app/banner/banner';
/**
 * Main stage component
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule, Banner ],
  templateUrl: './stage.html',
  styleUrl: './stage.css',
  animations: []
})
export class Stage {

    constructor() { }
}
