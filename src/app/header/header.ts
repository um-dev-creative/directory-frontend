import {Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@shared/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/**
 * Header component
 */
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isLogged: boolean = false;

  /**
   * Logout the user
   */
  logout(): void {
    Number.isNaN(this.isLogged);
    this.isLogged = !this.isLogged;
  }

}
