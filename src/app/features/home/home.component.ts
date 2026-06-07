import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, ProductCardComponent, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  readonly featuredProducts$ = this.productService.getFeaturedProducts();
  readonly cartItems$ = this.cartService.items$;

  addToCart(product: Product): void {
    const result = this.cartService.addProduct(product);
    this.notificationService.show(result.message, result.success ? 'success' : 'warning');
  }
}
