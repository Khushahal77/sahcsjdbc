import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CATEGORY_SECTIONS, MOCK_PRODUCTS } from '../../data/products.data';

interface ProductWithDiscount extends Product {
  originalPrice?: number;
  discountPercent?: number;
  isLimited?: boolean;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, AfterViewChecked {
  sections = CATEGORY_SECTIONS;
  productsByCategory: Record<string, ProductWithDiscount[]> = {};
  private scrollPending: string | null = null;
  visibleProducts: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    public cart: CartService
  ) {
    for (const section of CATEGORY_SECTIONS) {
      this.productsByCategory[section.id] = (MOCK_PRODUCTS.filter(p => p.category === section.id) as ProductWithDiscount[]).map((product, index) => {
        // Add discount info to some products
        if (index % 3 === 0) {
          const discount = [15, 20, 25][index % 3];
          return {
            ...product,
            originalPrice: product.price,
            discountPercent: discount,
            price: Math.round(product.price * (1 - discount / 100)),
            isLimited: index % 5 === 0
          };
        }
        return product;
      });
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

  addToCart(product: ProductWithDiscount): void {
    this.cart.addItem(product);
  }

  onProductVisible(productId: string): void {
    this.visibleProducts.add(productId);
  }
}
