import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, map, of, switchMap, tap } from 'rxjs';

import { Product, ProductVariant } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  imports: [AsyncPipe, BreadcrumbComponent, CurrencyPipe, ProductCardComponent, RouterLink],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  readonly product$: Observable<Product | undefined> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.productService.getProductById(id)),
    tap(() => {
      this.selectedOptions = {};
      this.selectedQuantity = 1;
      this.selectedImage = null;
    })
  );
  readonly relatedProducts$: Observable<Product[]> = this.product$.pipe(
    switchMap((product) => product ? this.productService.getRelatedProducts(product) : of([]))
  );
  readonly cartItems$ = this.cartService.items$;
  selectedOptions: Record<string, string> = {};
  selectedQuantity = 1;
  selectedImage: string | null = null;

  getBreadcrumbItems(product: Product): BreadcrumbItem[] {
    return [
      { label: 'Productos', routerLink: '/productos' },
      { label: product.category, routerLink: '/productos', queryParams: { category: product.category } },
      { label: product.subcategory, routerLink: '/productos', queryParams: { category: product.category, subcategory: product.subcategory } },
      { label: product.name }
    ];
  }

  getProductImages(product: Product): string[] {
    return product.images?.length ? product.images : [product.image];
  }

  getSelectedImage(product: Product): string {
    return this.selectedImage ?? this.getProductImages(product)[0];
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  getVariantOptionNames(product: Product): string[] {
    return [...new Set(product.variants?.flatMap((variant) => Object.keys(variant.options)) ?? [])];
  }

  getVariantOptionValues(product: Product, optionName: string): string[] {
    return [
      ...new Set(
        product.variants
          ?.filter((variant) =>
            Object.entries(this.selectedOptions).every(([name, value]) => name === optionName || variant.options[name] === value)
          )
          .map((variant) => variant.options[optionName])
          .filter(Boolean) ?? []
      )
    ];
  }

  selectVariantOption(optionName: string, value: string): void {
    this.selectedOptions = {
      ...this.selectedOptions,
      [optionName]: value
    };
    this.selectedQuantity = 1;
  }

  getSelectedVariant(product: Product): ProductVariant | undefined {
    const optionNames = this.getVariantOptionNames(product);

    if (optionNames.length === 0) {
      return undefined;
    }

    const hasAllOptions = optionNames.every((optionName) => this.selectedOptions[optionName]);

    if (!hasAllOptions) {
      return undefined;
    }

    return product.variants?.find((variant) =>
      optionNames.every((optionName) => variant.options[optionName] === this.selectedOptions[optionName])
    );
  }

  hasVariants(product: Product): boolean {
    return Boolean(product.variants?.length);
  }

  getMaxQuantity(product: Product): number {
    const selectedVariant = this.getSelectedVariant(product);

    if (this.hasVariants(product) && !selectedVariant) {
      return 0;
    }

    return this.cartService.getAvailableStock(product, selectedVariant);
  }

  decreaseQuantity(): void {
    this.selectedQuantity = Math.max(1, this.selectedQuantity - 1);
  }

  increaseQuantity(product: Product): void {
    this.selectedQuantity = Math.min(this.getMaxQuantity(product), this.selectedQuantity + 1);
  }

  addToCart(product: Product): void {
    const selectedVariant = this.getSelectedVariant(product);

    if (this.hasVariants(product) && !selectedVariant) {
      this.notificationService.show('Selecciona una variante antes de agregar el producto.', 'warning');
      return;
    }

    const result = this.cartService.addProduct(product, this.selectedQuantity, selectedVariant);
    this.notificationService.show(result.message, result.success ? 'success' : 'warning');
  }
}
