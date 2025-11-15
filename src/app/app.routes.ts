import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '/products' },
];
