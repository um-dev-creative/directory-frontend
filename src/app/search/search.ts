import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true, // Use standalone components for modularity
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class Search {
  searchText: string = '';
  onInput() {
    console.log('Texto actual:', this.searchText);
  }
  clearSearch() {
    this.searchText = '';
  }
}
