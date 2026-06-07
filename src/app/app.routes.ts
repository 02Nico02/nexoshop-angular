import { Routes } from '@angular/router';

import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { ProductsComponent } from './features/products/products.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'NexoShop Angular' },
  { path: 'productos', component: ProductsComponent, title: 'Catalogo | NexoShop Angular' },
  { path: 'productos/:id', component: ProductDetailComponent, title: 'Detalle | NexoShop Angular' },
  { path: 'carrito', component: CartComponent, title: 'Carrito | NexoShop Angular' },
  { path: 'checkout', component: CheckoutComponent, title: 'Checkout | NexoShop Angular' },
  { path: '**', redirectTo: '' }
];
