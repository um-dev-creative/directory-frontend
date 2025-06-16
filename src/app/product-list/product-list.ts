import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Button } from '@app/components/ui';
interface Product {
  id: number;
  name: string;
  image: string;
  alt: string;
  price: number;
  currency: string;
  link: string;
}

@Component({
  selector: 'app-product-list',
  imports: [ CommonModule, RouterModule, Button ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: Product[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.http.get<Product[]>('assets/mocks/product-list.json').subscribe(data => {
      this.products = data;
    });
  }


}
