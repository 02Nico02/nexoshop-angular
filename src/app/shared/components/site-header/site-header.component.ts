import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { ProductSearchSuggestion } from '../../../core/models/product.model';
import { CartSidebarService } from '../../../core/services/cart-sidebar.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductFilterStateService } from '../../../core/services/product-filter-state.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-site-header',
  imports: [AsyncPipe, FormsModule, RouterLink],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss'
})
export class SiteHeaderComponent {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly cartService = inject(CartService);
  private readonly cartSidebarService = inject(CartSidebarService);
  private readonly productFilterState = inject(ProductFilterStateService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly categories = this.productService.getCategories();
  readonly cartCount$ = this.cartService.items$.pipe(map((items) => this.cartService.getItemsCount(items)));
  search = this.productFilterState.getSearch();
  suggestions: ProductSearchSuggestion[] = [];
  showSuggestions = false;
  isMobileMenuOpen = false;
  isCategoryMenuOpen = false;

  constructor() {
    this.productFilterState.search$
      .pipe(takeUntilDestroyed())
      .subscribe((search) => {
        this.search = search;
      });
  }

  updateDraftSearch(search: string): void {
    this.search = search;
    this.suggestions = this.productService.getSearchSuggestions(search);
    this.showSuggestions = this.suggestions.length > 0;
  }

  submitSearch(): void {
    this.productFilterState.setSearch(this.search.trim());
    this.showSuggestions = false;
    this.closeMobileMenu();

    if (!this.router.url.startsWith('/productos')) {
      void this.router.navigate(['/productos']);
    }
  }

  selectSuggestion(suggestion: ProductSearchSuggestion): void {
    this.search = suggestion.label;

    if (suggestion.type === 'Producto' && suggestion.productId) {
      this.showSuggestions = false;
      this.closeMobileMenu();
      void this.router.navigate(['/productos', suggestion.productId]);
      return;
    }

    this.submitSearch();
  }

  hideSuggestions(): void {
    window.setTimeout(() => {
      this.showSuggestions = false;
    }, 120);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.isCategoryMenuOpen = false;
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.isCategoryMenuOpen = false;
  }

  toggleCategoryMenu(): void {
    this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
  }

  closeCategoryMenu(): void {
    this.isCategoryMenuOpen = false;
  }

  selectCategory(category: string): void {
    this.closeMobileMenu();
    void this.router.navigate(['/productos'], { queryParams: { category } });
  }

  openCartSidebar(): void {
    this.cartSidebarService.open();
    this.closeMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isCategoryMenuOpen) {
      return;
    }

    const target = event.target as Node | null;

    if (target && !this.hostElement.nativeElement.contains(target)) {
      this.closeCategoryMenu();
    }
  }
}
