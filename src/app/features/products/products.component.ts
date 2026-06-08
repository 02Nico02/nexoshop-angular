import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Product, ProductCategory, ProductFilters, ProductSort } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { NotificationService } from '../../core/services/notification.service';
import { ProductFilterStateService } from '../../core/services/product-filter-state.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-products',
  imports: [AsyncPipe, BreadcrumbComponent, FormsModule, ProductCardComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly productFilterState = inject(ProductFilterStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  readonly categories = this.productService.getCategories();
  readonly filters: ProductFilters = this.getInitialFilters();
  readonly cartItems$ = this.cartService.items$;
  viewMode: 'grid' | 'list' = 'grid';
  products$: Observable<Product[]> = this.productService.filterProducts(this.filters);
  isFilterPanelOpen = false;

  constructor() {
    const category = this.route.snapshot.queryParamMap.get('category') as ProductCategory | null;
    const subcategory = this.route.snapshot.queryParamMap.get('subcategory');

    if (category && this.categories.includes(category)) {
      this.filters.category = category;
      this.filters.subcategory = subcategory;
    }

    this.filters.search = this.productFilterState.getSearch();
    this.applyFilters();

    this.productFilterState.search$
      .pipe(takeUntilDestroyed())
      .subscribe((search) => {
        if (this.filters.search === search) {
          return;
        }

        this.filters.search = search;
        this.applyFilters();
      });
  }

  get subcategories(): string[] {
    return this.productService.getSubcategories(this.filters.category);
  }

  get attributeOptions(): { name: string; values: string[] }[] {
    if (!this.shouldShowAttributeFilters()) {
      return [];
    }

    return this.productService.getAttributeOptions(this.filters.category, this.filters.subcategory);
  }

  get breadcrumbItems(): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
      { label: 'Productos', action: () => this.navigateToCatalogLevel('all') }
    ];

    if (this.filters.category !== 'Todas') {
      items.push({ label: this.filters.category, action: () => this.navigateToCatalogLevel('category') });
    }

    if (this.filters.subcategory) {
      items.push({ label: this.filters.subcategory });
    }

    return items;
  }

  shouldShowAttributeFilters(): boolean {
    return Boolean(
      this.filters.category !== 'Todas' ||
      this.filters.search.trim() ||
      this.filters.minPrice !== null ||
      this.filters.maxPrice !== null
    );
  }

  applyFilters(): void {
    this.products$ = this.productService.filterProducts({
      ...this.filters,
      minPrice: this.toNullableNumber(this.filters.minPrice),
      maxPrice: this.toNullableNumber(this.filters.maxPrice)
    });
  }

  navigateToCatalogLevel(level: 'all' | 'category'): void {
    if (level === 'all') {
      void this.router.navigate(['/productos']);
      this.clearCategoryFilter();
      return;
    }

    this.clearSubcategoryFilter();
  }

  clearFilters(): void {
    this.productFilterState.clearSearch();
    Object.assign(this.filters, this.getInitialFilters());
    this.applyFilters();
    this.closeFilterPanel();
  }

  clearSearchFilter(): void {
    this.filters.search = '';
    this.productFilterState.clearSearch();
    this.applyFilters();
  }

  clearCategoryFilter(): void {
    this.filters.category = 'Todas';
    this.filters.subcategory = null;
    this.filters.attributes = {};
    this.applyFilters();
    this.closeFilterPanel();
  }

  selectCategory(category: ProductCategory): void {
    this.filters.category = category;
    this.filters.subcategory = null;
    this.filters.attributes = {};
    this.applyFilters();
    this.closeFilterPanel();
  }

  selectSubcategory(subcategory: string): void {
    this.filters.subcategory = subcategory;
    this.filters.attributes = {};
    this.applyFilters();
    this.closeFilterPanel();
  }

  clearSubcategoryFilter(): void {
    this.filters.subcategory = null;
    this.filters.attributes = {};
    this.applyFilters();
  }

  clearMinPriceFilter(): void {
    this.filters.minPrice = null;
    this.applyFilters();
  }

  clearMaxPriceFilter(): void {
    this.filters.maxPrice = null;
    this.applyFilters();
  }

  updateSort(sortBy: ProductSort): void {
    this.filters.sortBy = sortBy;
    this.applyFilters();
  }

  setViewMode(viewMode: 'grid' | 'list'): void {
    this.viewMode = viewMode;
  }

  toggleAttributeFilter(attributeName: string, value: string): void {
    const currentValues = this.filters.attributes[attributeName] ?? [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((currentValue) => currentValue !== value)
      : [...currentValues, value];

    this.filters.attributes = {
      ...this.filters.attributes,
      [attributeName]: nextValues
    };

    if (nextValues.length === 0) {
      delete this.filters.attributes[attributeName];
    }

    this.applyFilters();
  }

  openFilterPanel(): void {
    this.isFilterPanelOpen = true;
    this.updateFilterPanelScrollLock(true);
  }

  closeFilterPanel(): void {
    this.isFilterPanelOpen = false;
    this.updateFilterPanelScrollLock(false);
  }

  toggleFilterPanel(): void {
    if (this.isFilterPanelOpen) {
      this.closeFilterPanel();
      return;
    }

    this.openFilterPanel();
  }

  clearAttributeFilter(attributeName: string, value: string): void {
    const currentValues = this.filters.attributes[attributeName] ?? [];
    const nextValues = currentValues.filter((currentValue) => currentValue !== value);

    this.filters.attributes = {
      ...this.filters.attributes,
      [attributeName]: nextValues
    };

    if (nextValues.length === 0) {
      delete this.filters.attributes[attributeName];
    }

    this.applyFilters();
  }

  isAttributeSelected(attributeName: string, value: string): boolean {
    return this.filters.attributes[attributeName]?.includes(value) ?? false;
  }

  selectedAttributeEntries(): { name: string; value: string }[] {
    return Object.entries(this.filters.attributes).flatMap(([name, values]) =>
      values.map((value) => ({ name, value }))
    );
  }

  hasActiveFilters(): boolean {
    return Boolean(
      this.filters.search.trim() ||
      this.filters.category !== 'Todas' ||
      this.filters.subcategory !== null ||
      this.selectedAttributeEntries().length > 0 ||
      this.filters.minPrice !== null ||
      this.filters.maxPrice !== null
    );
  }

  addToCart(product: Product): void {
    const result = this.cartService.addProduct(product);
    this.notificationService.show(result.message, result.success ? 'success' : 'warning');
  }

  categoryLabel(category: ProductCategory): string {
    return category;
  }

  private getInitialFilters(): ProductFilters {
    return {
      search: this.productFilterState.getSearch(),
      category: 'Todas',
      subcategory: null,
      attributes: {},
      minPrice: null,
      maxPrice: null,
      sortBy: 'featured'
    };
  }

  private toNullableNumber(value: number | null): number | null {
    return value === null || Number.isNaN(Number(value)) ? null : Number(value);
  }

  private updateFilterPanelScrollLock(locked: boolean): void {
    document.body.classList.toggle('catalog-filters-open', locked);
  }
}
