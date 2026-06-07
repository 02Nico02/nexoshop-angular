import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly notificationService = inject(NotificationService);
  readonly cartService = inject(CartService);
  readonly items$ = this.cartService.items$;
  submittedOrder: Order | null = null;

  readonly checkoutForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    address: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.cartService.getItems().length === 0) {
      this.notificationService.show('Agrega productos antes de finalizar la compra.', 'warning');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notificationService.show('Completa los campos obligatorios para finalizar la compra.', 'warning');
      return;
    }

    const items = this.cartService.getItems();
    const subtotal = this.cartService.getItemsBaseSubtotal(items);
    const discountTotal = this.cartService.getDiscountTotal(items);
    const taxTotal = this.cartService.getTaxTotal(items);
    const total = this.cartService.getTotal(items);
    this.submittedOrder = this.orderService.createOrder(this.checkoutForm.getRawValue(), items, subtotal, discountTotal, taxTotal, total);
    this.cartService.clearCart();
    this.checkoutForm.reset();
    this.notificationService.show('Compra finalizada correctamente.', 'success');
  }

  isInvalid(controlName: keyof typeof this.checkoutForm.controls): boolean {
    const control = this.checkoutForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
