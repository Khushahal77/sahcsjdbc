import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  constructor(public cart: CartService) {}

  removeItem(productId: string): void {
    this.cart.removeItem(productId);
  }

  updateQuantity(productId: string, delta: number): void {
    const item = this.cart.items.find(i => i.product.id === productId);
    if (item) {
      this.cart.updateQuantity(productId, item.quantity + delta);
    }
  }
}
