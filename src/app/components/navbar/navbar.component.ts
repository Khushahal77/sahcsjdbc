import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { MOCK_PRODUCTS } from '../../data/products.data';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isOpen = false;
  dropdownOpen = false;
  cartCount = 0;
  isDarkMode = true;
  searchQuery: string = '';
  searchResults: Product[] = [];
  showSearchResults: boolean = false;
  private sub?: Subscription;
  private debounceTimer: any;

  constructor(
    public authService: AuthService,
    public cart: CartService
    , private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.cart.count$.subscribe(c => this.cartCount = c);
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme-mode');
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : true;
    this.applyTheme(this.isDarkMode);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleCategories(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme-mode', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;

    // Debounce the search for better performance
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    if (query.trim().length === 0) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.searchResults = this.filterProducts(query);
      this.showSearchResults = true;
    }, 300);
  }

  onSearchBlur(): void {
    // delay closing slightly to allow click handlers on results to fire
    setTimeout(() => this.closeSearchResults(), 200);
  }

  private filterProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase().trim();
    return MOCK_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSearchResults = false;
    this.searchResults = [];
  }

  closeSearchResults(): void {
    this.showSearchResults = false;
  }

  onSearchResultClick(product: Product): void {
    this.clearSearch();
    // navigate to product detail page
    this.router.navigate(['/product', product.id]);
  }
}
