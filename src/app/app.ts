import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Footer} from '@app/footer/footer';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'directory-frontend';
}
