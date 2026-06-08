import { CartItem } from './cart-item.model';
import { CustomerData } from './customer-data.model';

export type ShippingMethodCode = 'standard' | 'express' | 'pickup';
export type PaymentMethodCode = 'credit-card' | 'debit-card' | 'transfer' | 'cash';

export interface ShippingMethodSelection {
  code: ShippingMethodCode;
  label: string;
  cost: number;
  eta: string;
}

export interface PaymentMethodSelection {
  code: PaymentMethodCode;
  label: string;
}

export interface PaymentDetails {
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
}

export interface OrderCreateInput {
  customer: CustomerData;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingMethod: ShippingMethodSelection;
  paymentMethod: PaymentMethodSelection;
  paymentDetails: PaymentDetails | null;
  total: number;
}

export interface Order {
  id: string;
  customer: CustomerData;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingMethod: ShippingMethodSelection;
  paymentMethod: PaymentMethodSelection;
  paymentDetails: PaymentDetails | null;
  shippingCost: number;
  total: number;
  createdAt: string;
}
