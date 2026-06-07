import { AsyncPipe, CurrencyPipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../core/models/cart-item.model';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe, CurrencyPipe, KeyValuePipe, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  readonly items$ = this.cartService.items$;

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const requestedQuantity = Number(input.value);
    const result = this.cartService.updateQuantity(item.product.id, requestedQuantity, item.variant?.id);

    if (!result.success) {
      input.value = String(item.quantity);
    }

    this.notificationService.show(result.message, result.success ? 'success' : 'warning');
  }

  removeProduct(item: CartItem): void {
    this.cartService.removeProduct(item.product.id, item.variant?.id);
    this.notificationService.show(`${item.product.name} se elimino del carrito.`, 'info');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.notificationService.show('Carrito vaciado.', 'info');
  }
}
