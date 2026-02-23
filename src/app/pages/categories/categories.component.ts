import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CATEGORY_SECTIONS, MOCK_PRODUCTS } from '../../data/products.data';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, AfterViewChecked {
  sections = CATEGORY_SECTIONS;
  productsByCategory: Record<string, Product[]> = {};
  private scrollPending: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public cart: CartService
  ) {
    for (const section of CATEGORY_SECTIONS) {
      this.productsByCategory[section.id] = MOCK_PRODUCTS.filter(p => p.category === section.id);
    }
  }

  ngOnInit(): void {
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      this.scrollPending = fragment;
    }
    this.route.fragment.subscribe(f => {
      if (f) this.scrollPending = f;
    });
  }

  ngAfterViewChecked(): void {
    if (this.scrollPending) {
      const el = document.getElementById(this.scrollPending);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.scrollPending = null;
      }
    }
  }

  addToCart(product: Product): void {
    this.cart.addItem(product);
  }
}
