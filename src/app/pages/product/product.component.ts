import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MOCK_PRODUCTS } from '../../data/products.data';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  product?: Product;
  related: Product[] = [];
  prescriptionRequired = false;
  // extended details
  currentImage?: string;
  gallery: string[] = [];
  batchNumber?: string;
  manufactureDate?: string;
  expiryDate?: string;
  manufacturer?: string;
  origin?: string;
  sku?: string;

  constructor(private route: ActivatedRoute, public cart: CartService) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product = MOCK_PRODUCTS.find(p => p.id === id) as Product | undefined;
      if (this.product) {
        // related products: same category
        this.related = MOCK_PRODUCTS.filter(x => x.category === this.product!.category && x.id !== this.product!.id).slice(0,4);
        const prescriptionIds = new Set(['pr1','ph1','ph2','oa10','vt2','pp3']);
        this.prescriptionRequired = prescriptionIds.has(this.product.id);
        this.initExtendedDetails(this.product);
      }
    }
  }

  addToCart() {
    if (!this.product) return;
    if (this.prescriptionRequired) {
      // route to upload modal in home or show info; for now, add and show alert
      alert('This product requires a prescription. Please upload a prescription from the Cart or Orders page.');
      return;
    }
    this.cart.addItem(this.product, 1);
  }

  private initExtendedDetails(p: Product) {
    // gallery: produce a few placeholder variants
    this.gallery = [
      p.imageUrl,
      p.imageUrl + '?v=1',
      p.imageUrl + '?v=2'
    ];
    this.currentImage = this.gallery[0];

    // batch number and SKU
    this.batchNumber = 'BN-' + p.id.toUpperCase() + '-' + (1000 + Math.floor(Math.random() * 9000));
    this.sku = 'SKU-' + p.id.toUpperCase();

    // manufacturer and origin mapping heuristics
    const makers = ['Healix Pharma', 'Wellcare Labs', 'GreenLeaf Remedies', 'Nova Meds'];
    this.manufacturer = makers[Math.floor(Math.random() * makers.length)];
    const origins = ['India', 'USA', 'Germany', 'UK', 'China'];
    this.origin = origins[Math.floor(Math.random() * origins.length)];

    // manufacture date within last 24 months, expiry +24 months
    const now = new Date();
    const mfg = new Date(now.getFullYear(), now.getMonth() - Math.floor(Math.random() * 18), 1);
    const exp = new Date(mfg.getFullYear() + 2, mfg.getMonth(), 1);
    this.manufactureDate = mfg.toISOString().slice(0,10);
    this.expiryDate = exp.toISOString().slice(0,10);
  }

  changeImage(url: string) {
    this.currentImage = url;
  }
}
