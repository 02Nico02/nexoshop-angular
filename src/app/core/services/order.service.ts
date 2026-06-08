import { Injectable } from '@angular/core';

import { Order, OrderCreateInput } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  createOrder(input: OrderCreateInput): Order {
    return {
      id: `NS-${Date.now()}`,
      customer: input.customer,
      items: input.items,
      subtotal: input.subtotal,
      discountTotal: input.discountTotal,
      taxTotal: input.taxTotal,
      shippingMethod: input.shippingMethod,
      paymentMethod: input.paymentMethod,
      paymentDetails: input.paymentDetails,
      shippingCost: input.shippingMethod.cost,
      total: input.total,
      createdAt: new Date().toISOString()
    };
  }
}
