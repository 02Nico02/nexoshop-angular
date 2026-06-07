import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  readonly cartService = inject(CartService);

  @Input({ required: true }) product!: Product;
  @Input() currentQuantity = 0;
  @Output() addToCart = new EventEmitter<Product>();

  get isAddDisabled(): boolean {
    return this.product.stock <= 0 || this.currentQuantity >= this.product.stock;
  }

}
