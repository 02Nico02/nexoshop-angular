import { CartItem } from './cart-item.model';
import { CustomerData } from './customer-data.model';

export interface Order {
  id: string;
  customer: CustomerData;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  createdAt: string;
}
