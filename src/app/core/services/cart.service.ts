import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CartItem } from '../models/cart-item.model';
import { CartActionResult } from '../models/cart-action-result.model';
import { Product, ProductVariant } from '../models/product.model';
import { PRODUCTS } from '../data/products.mock';

const CART_STORAGE_KEY = 'nexoshop-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  readonly items$ = this.itemsSubject.asObservable();

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addProduct(product: Product, quantity = 1, variant?: ProductVariant): CartActionResult {
    const availableStock = this.getAvailableStock(product, variant);

    if (product.variants?.length && !variant) {
      return {
        success: false,
        message: `Selecciona una variante de ${product.name}.`
      };
    }

    if (availableStock <= 0) {
      return {
        success: false,
        message: `${product.name} no tiene stock disponible.`
      };
    }

    const items = [...this.itemsSubject.value];
    const itemIndex = items.findIndex((item) => this.isSameCartLine(item, product.id, variant?.id));

    if (itemIndex >= 0) {
      const currentItem = items[itemIndex];
      const nextQuantity = currentItem.quantity + quantity;

      if (currentItem.quantity >= availableStock) {
        return {
          success: false,
          message: `Ya agregaste todo el stock disponible de ${product.name}.`
        };
      }

      items[itemIndex] = {
        ...currentItem,
        quantity: Math.min(nextQuantity, availableStock)
      };
    } else {
      items.push({ product, variant, quantity: Math.min(quantity, availableStock) });
    }

    this.updateCart(items);

    return {
      success: true,
      message: `${product.name} se agrego al carrito.`
    };
  }

  updateQuantity(productId: number, quantity: number, variantId?: string): CartActionResult {
    const targetItem = this.itemsSubject.value.find((item) => this.isSameCartLine(item, productId, variantId));

    if (!targetItem) {
      return {
        success: false,
        message: 'El producto ya no esta en el carrito.'
      };
    }

    const availableStock = this.getAvailableStock(targetItem.product, targetItem.variant);

    if (quantity > availableStock) {
      return {
        success: false,
        message: `Solo hay ${availableStock} unidades disponibles de ${targetItem.product.name}.`
      };
    }

    const items = this.itemsSubject.value
      .map((item) => {
        if (!this.isSameCartLine(item, productId, variantId)) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(Math.max(quantity, 1), this.getAvailableStock(item.product, item.variant))
        };
      })
      .filter((item) => item.quantity > 0);

    this.updateCart(items);

    return {
      success: true,
      message: `Cantidad actualizada para ${targetItem.product.name}.`
    };
  }

  removeProduct(productId: number, variantId?: string): void {
    this.updateCart(this.itemsSubject.value.filter((item) => !this.isSameCartLine(item, productId, variantId)));
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getItemsCount(items = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getProductQuantity(productId: number, items = this.itemsSubject.value, variantId?: string): number {
    return items
      .filter((item) => this.isSameCartLine(item, productId, variantId))
      .reduce((total, item) => total + item.quantity, 0);
  }

  canAddProduct(product: Product, items = this.itemsSubject.value, variant?: ProductVariant): boolean {
    if (product.variants?.length && !variant) {
      return false;
    }

    const availableStock = this.getAvailableStock(product, variant);
    return availableStock > 0 && this.getProductQuantity(product.id, items, variant?.id) < availableStock;
  }

  getAvailableStock(product: Product, variant?: ProductVariant): number {
    return variant?.stock ?? product.stock;
  }

  hasDiscount(product: Product): boolean {
    return (product.discountPercentage ?? 0) > 0;
  }

  hasTax(product: Product): boolean {
    return (product.taxPercentage ?? 0) > 0;
  }

  getUnitDiscount(product: Product): number {
    return product.price * ((product.discountPercentage ?? 0) / 100);
  }

  getUnitPriceAfterDiscount(product: Product): number {
    return product.price - this.getUnitDiscount(product);
  }

  getUnitTax(product: Product): number {
    const taxPercentage = product.taxPercentage ?? 0;

    if (taxPercentage <= 0) {
      return 0;
    }

    return this.getUnitPriceAfterDiscount(product) * (taxPercentage / (100 + taxPercentage));
  }

  getUnitFinalPrice(product: Product): number {
    return this.getUnitPriceAfterDiscount(product);
  }

  getLineBaseSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  getLineDiscount(item: CartItem): number {
    return this.getUnitDiscount(item.product) * item.quantity;
  }

  getLineTax(item: CartItem): number {
    return this.getUnitTax(item.product) * item.quantity;
  }

  getSubtotal(item: CartItem): number {
    return this.getUnitFinalPrice(item.product) * item.quantity;
  }

  getItemsBaseSubtotal(items = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + this.getLineBaseSubtotal(item), 0);
  }

  getDiscountTotal(items = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + this.getLineDiscount(item), 0);
  }

  getTaxTotal(items = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + this.getLineTax(item), 0);
  }

  getTotal(items = this.itemsSubject.value): number {
    return items.reduce((total, item) => total + this.getSubtotal(item), 0);
  }

  private updateCart(items: CartItem[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  private loadCart(): CartItem[] {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    try {
      const storedItems = JSON.parse(storedCart) as CartItem[];

      return storedItems.map((item) => ({
        ...item,
        product: PRODUCTS.find((product) => product.id === item.product.id) ?? item.product,
        variant: PRODUCTS
          .find((product) => product.id === item.product.id)
          ?.variants
          ?.find((variant) => variant.id === item.variant?.id) ?? item.variant
      }));
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  }

  private isSameCartLine(item: CartItem, productId: number, variantId?: string): boolean {
    return item.product.id === productId && (item.variant?.id ?? null) === (variantId ?? null);
  }
}
