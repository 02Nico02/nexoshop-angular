import { Injectable } from '@angular/core';

import { CartItem } from '../models/cart-item.model';
import { CustomerData } from '../models/customer-data.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  createOrder(customer: CustomerData, items: CartItem[], subtotal: number, discountTotal: number, taxTotal: number, total: number): Order {
    return {
      id: `NS-${Date.now()}`,
      customer,
      items,
      subtotal,
      discountTotal,
      taxTotal,
      total,
      createdAt: new Date().toISOString()
    };
  }
}
