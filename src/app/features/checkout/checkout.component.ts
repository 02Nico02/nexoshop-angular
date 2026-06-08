import { AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CartItem } from '../../core/models/cart-item.model';
import {
  Order,
  OrderCreateInput,
  PaymentMethodCode,
  PaymentMethodSelection,
  ShippingMethodCode,
  ShippingMethodSelection
} from '../../core/models/order.model';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { OrderService } from '../../core/services/order.service';

const SHIPPING_METHODS: ShippingMethodSelection[] = [
  { code: 'standard', label: 'Envío estándar', cost: 0, eta: '3 a 5 días hábiles' },
  { code: 'express', label: 'Envío express', cost: 4500, eta: '24 a 48 hs' },
  { code: 'pickup', label: 'Retiro en sucursal', cost: 0, eta: 'Listo en 24 hs' }
];

const PAYMENT_METHODS: PaymentMethodSelection[] = [
  { code: 'credit-card', label: 'Tarjeta de crédito' },
  { code: 'debit-card', label: 'Tarjeta de débito' },
  { code: 'transfer', label: 'Transferencia bancaria' },
  { code: 'cash', label: 'Pago contra entrega' }
];

@Component({
  selector: 'app-checkout',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly notificationService = inject(NotificationService);
  readonly cartService = inject(CartService);
  readonly items$ = this.cartService.items$;
  submittedOrder: Order | null = null;
  formSubmitted = false;

  readonly shippingMethods = SHIPPING_METHODS;
  readonly paymentMethods = PAYMENT_METHODS;

  readonly checkoutForm = this.formBuilder.nonNullable.group({
    contact: this.formBuilder.nonNullable.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8)]]
    }),
    shippingAddress: this.formBuilder.nonNullable.group({
      street: ['', [Validators.required, Validators.minLength(4)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      province: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.minLength(3)]],
      reference: ['']
    }),
    shippingMethod: this.formBuilder.nonNullable.control<ShippingMethodCode>('standard', [Validators.required]),
    paymentMethod: this.formBuilder.control<PaymentMethodCode | null>(null, [Validators.required]),
    paymentDetails: this.formBuilder.nonNullable.group({
      holder: ['', [Validators.minLength(3)]],
      number: ['', [Validators.minLength(12)]],
      expiry: ['', [Validators.minLength(4)]],
      cvv: ['', [Validators.minLength(3)]]
    })
  });

  constructor() {
    this.checkoutForm.controls.paymentMethod.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((paymentMethod) => {
        this.updatePaymentValidators(paymentMethod);
      });

    this.updatePaymentValidators(this.checkoutForm.controls.paymentMethod.value);
  }

  get paymentDetailsControls(): Record<string, { invalid: boolean; dirty: boolean; touched: boolean }> {
    return this.checkoutForm.controls.paymentDetails.controls;
  }

  get selectedShippingMethod(): ShippingMethodSelection {
    return this.shippingMethods.find((method) => method.code === this.checkoutForm.controls.shippingMethod.value) ?? this.shippingMethods[0];
  }

  get selectedPaymentMethod(): PaymentMethodSelection | null {
    return this.paymentMethods.find((method) => method.code === this.checkoutForm.controls.paymentMethod.value) ?? null;
  }

  isPaymentMethodSelected(methodCode: PaymentMethodCode): boolean {
    return this.checkoutForm.controls.paymentMethod.value === methodCode;
  }

  get shippingCost(): number {
    return this.selectedShippingMethod.cost;
  }

  get paymentRequiresCard(): boolean {
    return this.checkoutForm.controls.paymentMethod.value === 'credit-card' || this.checkoutForm.controls.paymentMethod.value === 'debit-card';
  }

  get paymentHelpText(): string {
    switch (this.checkoutForm.controls.paymentMethod.value) {
      case 'transfer':
        return 'Una vez confirmada la compra, te mostraremos los datos para realizar la transferencia.';
      case 'cash':
        return 'Pagás al recibir el pedido. El repartidor te pedirá el importe exacto si corresponde.';
      default:
        return 'Completá los datos de la tarjeta para simular el cobro.';
    }
  }

  get paymentSecurityNote(): string {
    return 'Pago seguro simulado. No ingreses datos reales.';
  }

  get paymentCardBrands(): string {
    return 'Visa · Mastercard · Amex';
  }

  paymentMethodDescription(methodCode: PaymentMethodCode): string {
    switch (methodCode) {
      case 'credit-card':
        return 'Visa, Mastercard y Amex';
      case 'debit-card':
        return 'Débito inmediato y validación simulada';
      case 'transfer':
        return 'Acreditación manual después de confirmar';
      case 'cash':
        return 'Disponible según la zona de entrega';
      default:
        return '';
    }
  }

  paymentMethodInfo(methodCode: PaymentMethodCode): string {
    switch (methodCode) {
      case 'credit-card':
        return 'Pago seguro simulado. No se procesará ningún cargo real.';
      case 'debit-card':
        return 'Se validarán los datos de forma simulada.';
      case 'transfer':
        return 'Al confirmar la compra se mostrarán los datos bancarios para realizar la transferencia. La reserva del pedido quedará pendiente de acreditación.';
      case 'cash':
        return 'Pagás al recibir el pedido. Disponible según la zona de entrega seleccionada.';
      default:
        return '';
    }
  }

  get subtotal(): number {
    return this.cartService.getItemsBaseSubtotal(this.getItemsSnapshot());
  }

  get discountTotal(): number {
    return this.cartService.getDiscountTotal(this.getItemsSnapshot());
  }

  get taxTotal(): number {
    return this.cartService.getTaxTotal(this.getItemsSnapshot());
  }

  get productsTotal(): number {
    return this.cartService.getTotal(this.getItemsSnapshot());
  }

  get total(): number {
    return this.productsTotal + this.shippingCost;
  }

  submit(): void {
    this.formSubmitted = true;

    if (this.cartService.getItems().length === 0) {
      this.notificationService.show('Agrega productos antes de finalizar la compra.', 'warning');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notificationService.show('Completa los campos obligatorios para finalizar la compra.', 'warning');
      return;
    }

    const items = this.getItemsSnapshot();
    const customer = {
      ...this.checkoutForm.controls.contact.getRawValue(),
      address: this.checkoutForm.controls.shippingAddress.getRawValue()
    };

    const orderInput: OrderCreateInput = {
      customer,
      items,
      subtotal: this.subtotal,
      discountTotal: this.discountTotal,
      taxTotal: this.taxTotal,
      shippingMethod: this.selectedShippingMethod,
      paymentMethod: this.selectedPaymentMethod!,
      paymentDetails: this.paymentRequiresCard ? this.checkoutForm.controls.paymentDetails.getRawValue() : null,
      total: this.total
    };

    this.submittedOrder = this.orderService.createOrder(orderInput);
    this.cartService.clearCart();
    this.resetFormState();
    this.notificationService.show('Compra finalizada correctamente.', 'success');
  }

  isInvalid(path: string): boolean {
    const control = this.checkoutForm.get(path);

    return Boolean(control && control.invalid && (control.dirty || control.touched || this.formSubmitted));
  }

  hasPaymentError(): boolean {
    return this.paymentRequiresCard && Object.values(this.paymentDetailsControls).some((control) => control.invalid && (control.dirty || control.touched || this.formSubmitted));
  }

  formatAddress(): string {
    if (!this.submittedOrder) {
      return '';
    }

    const address = this.submittedOrder.customer.address;
    return `${address.street}, ${address.city}, ${address.province} - CP ${address.postalCode}${address.reference ? ` · ${address.reference}` : ''}`;
  }

  trackByItemId(_index: number, item: CartItem): string {
    return `${item.product.id}-${item.variant?.id ?? 'base'}`;
  }

  private updatePaymentValidators(paymentMethod: PaymentMethodCode | null): void {
    const paymentGroup = this.checkoutForm.controls.paymentDetails;
    const requiresCard = paymentMethod === 'credit-card' || paymentMethod === 'debit-card';

    const requiredValidators = [Validators.required, Validators.minLength(3)];

    paymentGroup.controls.holder.setValidators(requiresCard ? requiredValidators : []);
    paymentGroup.controls.number.setValidators(requiresCard ? [Validators.required, Validators.minLength(12)] : []);
    paymentGroup.controls.expiry.setValidators(requiresCard ? [Validators.required, Validators.minLength(4)] : []);
    paymentGroup.controls.cvv.setValidators(requiresCard ? [Validators.required, Validators.minLength(3)] : []);

    Object.values(paymentGroup.controls).forEach((control) => control.updateValueAndValidity({ emitEvent: false }));
  }

  private getItemsSnapshot(): CartItem[] {
    return this.cartService.getItems();
  }

  private resetFormState(): void {
    this.formSubmitted = false;
    this.checkoutForm.reset({
      contact: {
        fullName: '',
        email: '',
        phone: ''
      },
      shippingAddress: {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        reference: ''
      },
      shippingMethod: 'standard',
      paymentMethod: null,
      paymentDetails: {
        holder: '',
        number: '',
        expiry: '',
        cvv: ''
      }
    });
    this.updatePaymentValidators(this.checkoutForm.controls.paymentMethod.value);
  }
}
