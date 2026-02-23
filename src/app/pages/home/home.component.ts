import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MOCK_PRODUCTS } from '../../data/products.data';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly products: Product[] = MOCK_PRODUCTS;

  // select deals: pick first 4 across categories with a visible discount
  deals = this.products.slice(0, 12).filter((_, i) => i % 2 === 0).slice(0, 4).map(p => ({
    product: p,
    discountPercent: 20 + (p.price % 15),
  }));

  // featured: 6 varied products
  featured: Product[] = this.products.slice(2, 8);

  categories = [
    { id: 'baby-care', title: 'Baby Care', icon: '🍼' },
    { id: 'vitamins', title: 'Vitamins', icon: '💊' },
    { id: 'physical-health-wellness', title: 'Wellness', icon: '🍃' },
    { id: 'protein-powder', title: 'Protein', icon: '🥤' },
    { id: 'first-aid', title: 'First Aid', icon: '🩹' },
    { id: 'old-age', title: 'Senior Care', icon: '🧓' }
  ];

  // Simulate prescription-required product ids
  prescriptionIds = new Set<string>(['pr1', 'ph1', 'ph2', 'oa10', 'vt2', 'pp3']);

  // Upload modal state
  showUploadModal = false;
  uploadTarget?: Product;
  uploadSuccess = false;

  constructor(private cart: CartService, private router: Router) {}

  navigateToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

  discountedPrice(product: Product, percent: number) {
    return Math.round(product.price * (1 - percent / 100));
  }

  requiresPrescription(p: Product) {
    return this.prescriptionIds.has(productIdOf(p));
  }

  handleAddToCart(p: Product, isDeal = false, discountPercent = 0) {
    if (this.prescriptionIds.has(p.id)) {
      this.uploadTarget = p;
      this.showUploadModal = true;
      this.uploadSuccess = false;
      return;
    }
    this.cart.addItem(p, 1);
  }

  handleFileSelected(files: FileList | null) {
    if (!files || files.length === 0 || !this.uploadTarget) return;
    // In production we'd upload file to backend; here we simulate success
    setTimeout(() => {
      this.cart.addItem(this.uploadTarget as Product, 1);
      this.uploadSuccess = true;
      setTimeout(() => {
        this.showUploadModal = false;
        this.uploadTarget = undefined;
        this.uploadSuccess = false;
      }, 1100);
    }, 700);
  }

  // wrapper to satisfy template strict event typing
  handleFileSelectedEvent(event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.handleFileSelected(input ? input.files : null);
  }

  closeModal() {
    this.showUploadModal = false;
    this.uploadTarget = undefined;
    this.uploadSuccess = false;
  }
}

function productIdOf(p: Product) { return p.id; }
