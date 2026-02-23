import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)},
  { path: 'product/:id', loadComponent: () => import('./pages/product/product.component').then(m => m.ProductComponent) },
  { path: 'category', redirectTo: '/categories', pathMatch: 'full' },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
    { path: 'order', loadComponent: () => import('./pages/order/order.component').then(m => m.OrderComponent) ,
canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: '**', redirectTo: '/home' }
];
