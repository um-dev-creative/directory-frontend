import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-marquee',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
})
export class Marquee implements OnInit {
  images: { id: number; src: string; alt: string; link: string }[] = [];
  duplicatedImages: { id: number; src: string; alt: string, link: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const numberOfItems = this.images.length;
    document.documentElement.style.setProperty('--number-of-items', numberOfItems.toString());

    this.http.get<{ id: number; src: string; alt: string, link: string }[]>('/assets/data/marquee-images.json')
      .subscribe(data => {
        this.images = data;
        // Duplicamos las imágenes para crear el efecto continuo
        this.duplicatedImages = [...this.images, ...this.images];
      });
  }
}
