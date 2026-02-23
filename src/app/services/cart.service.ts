import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();
  count$ = this.items$.pipe(map(items => items.reduce((sum, i) => sum + i.quantity, 0)));

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get count(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  addItem(product: Product, quantity = 1): void {
    const current = this.itemsSubject.value;
    const existing = current.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      this.itemsSubject.next([...current]);
    } else {
      this.itemsSubject.next([...current, { product, quantity }]);
    }
  }

  removeItem(productId: string): void {
    this.itemsSubject.next(this.items.filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }
    const current = this.itemsSubject.value;
    const item = current.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.itemsSubject.next([...current]);
    }
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}
