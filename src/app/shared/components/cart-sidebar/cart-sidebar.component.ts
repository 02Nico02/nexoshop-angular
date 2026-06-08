import { AsyncPipe, CurrencyPipe, DOCUMENT, KeyValuePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CartItem } from '../../../core/models/cart-item.model';
import { CartService } from '../../../core/services/cart.service';
import { CartSidebarService } from '../../../core/services/cart-sidebar.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-cart-sidebar',
  imports: [AsyncPipe, CurrencyPipe, KeyValuePipe, RouterLink],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss'
})
export class CartSidebarComponent {
  private readonly document = inject(DOCUMENT);
  readonly cartService = inject(CartService);
  readonly cartSidebarService = inject(CartSidebarService);
  private readonly notificationService = inject(NotificationService);
  readonly items$ = this.cartService.items$;
  readonly isOpen$ = this.cartSidebarService.isOpen$;

  constructor() {
    this.isOpen$
      .pipe(takeUntilDestroyed())
      .subscribe((isOpen) => {
        this.setDocumentScrollLock(isOpen);
      });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cartSidebarService.close();
  }

  close(): void {
    this.cartSidebarService.close();
  }

  removeProduct(item: CartItem): void {
    this.cartService.removeProduct(item.product.id, item.variant?.id);
    this.notificationService.show(`${item.product.name} se elimino del carrito.`, 'info');
  }

  private setDocumentScrollLock(isLocked: boolean): void {
    const html = this.document.documentElement;
    const body = this.document.body;

    if (isLocked) {
      html.classList.add('cart-drawer-open');
      body.classList.add('cart-drawer-open');
      return;
    }

    html.classList.remove('cart-drawer-open');
    body.classList.remove('cart-drawer-open');
  }
}
