import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
  @Input() placeholder: string = 'menu_header.search.placeholder';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() maxLength: number = 255;
  @Input() minLength: number = 1;
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() searchClear = new EventEmitter<void>();

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;

  searchText: string = '';

  onInput() {
    this.searchChange.emit(this.searchText);
    console.log('Texto actual:', this.searchText);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchText.trim().length >= this.minLength) {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.searchText.trim().length >= this.minLength && !this.disabled && !this.loading) {
      this.searchSubmit.emit(this.searchText.trim());
    }
  }

  clearSearch() {
    this.searchText = '';
    this.searchClear.emit();
    this.searchChange.emit('');
    
    // Mantener el foco en el input después de limpiar
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  focusInput() {
    if (this.searchInput && !this.disabled) {
      this.searchInput.nativeElement.focus();
    }
  }

  get isSearchValid(): boolean {
    return this.searchText.trim().length >= this.minLength;
  }

  get containerClasses(): string {
    const baseClasses = [
      'tw-w-full',
      'tw-flex',
      'tw-items-center',
      'tw-bg-beige-100',
      'tw-rounded-full',
      'tw-px-1.5',
      'tw-h-10',
      'tw-shadow-soft',
      'tw-transition-all',
      'tw-duration-200',
      'tw-border',
      'tw-border-beige-300'
    ];

    const stateClasses = [];
    
    if (this.disabled) {
      stateClasses.push('tw-opacity-50', 'tw-cursor-not-allowed');
    } else {
      stateClasses.push(
        'hover:tw-bg-beige-200',
        'focus-within:tw-border-emerald-400',
        'focus-within:tw-shadow-lg',
        'focus-within:tw-shadow-emerald-20'
      );
    }

    if (this.loading) {
      stateClasses.push('search-loading');
    }

    return [...baseClasses, ...stateClasses].join(' ');
  }
}
