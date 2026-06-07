import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PRODUCTS } from '../data/products.mock';
import { Product, ProductCategory, ProductFilters, ProductSearchSuggestion } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly products = PRODUCTS;

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(this.products.filter((product) => product.featured));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find((product) => product.id === id));
  }

  getRelatedProducts(product: Product, limit = 4): Observable<Product[]> {
    return of(
      this.products
        .filter((relatedProduct) => relatedProduct.id !== product.id && relatedProduct.category === product.category)
        .slice(0, limit)
    );
  }

  getCategories(): ProductCategory[] {
    return [...new Set(this.products.map((product) => product.category))];
  }

  getSubcategories(category: ProductCategory | 'Todas'): string[] {
    return [
      ...new Set(
        this.products
          .filter((product) => category === 'Todas' || product.category === category)
          .map((product) => product.subcategory)
      )
    ];
  }

  getAttributeOptions(category: ProductCategory | 'Todas', subcategory: string | null): { name: string; values: string[] }[] {
    const options = new Map<string, Set<string>>();

    this.products
      .filter((product) => category === 'Todas' || product.category === category)
      .filter((product) => !subcategory || product.subcategory === subcategory)
      .forEach((product) => {
        product.attributes.forEach((attribute) => {
          const values = options.get(attribute.name) ?? new Set<string>();
          values.add(attribute.value);
          options.set(attribute.name, values);
        });
      });

    return [...options.entries()].map(([name, values]) => ({
      name,
      values: [...values].sort((a, b) => a.localeCompare(b))
    }));
  }

  getSearchSuggestions(query: string, limit = 6): ProductSearchSuggestion[] {
    const search = query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    const suggestions: ProductSearchSuggestion[] = [];
    const addSuggestion = (suggestion: ProductSearchSuggestion): void => {
      const key = `${suggestion.type}-${suggestion.label}`.toLowerCase();
      const exists = suggestions.some((currentSuggestion) => `${currentSuggestion.type}-${currentSuggestion.label}`.toLowerCase() === key);

      if (!exists && suggestions.length < limit) {
        suggestions.push(suggestion);
      }
    };

    this.products
      .filter((product) => product.name.toLowerCase().includes(search))
      .forEach((product) => addSuggestion({ label: product.name, type: 'Producto', hint: product.category, productId: product.id }));

    this.getCategories()
      .filter((category) => category.toLowerCase().includes(search))
      .forEach((category) => addSuggestion({ label: category, type: 'Categoria' }));

    this.getSubcategories('Todas')
      .filter((subcategory) => subcategory.toLowerCase().includes(search))
      .forEach((subcategory) => addSuggestion({ label: subcategory, type: 'Subcategoria' }));

    this.products
      .flatMap((product) => product.attributes)
      .filter((attribute) => attribute.name.toLowerCase().includes(search) || attribute.value.toLowerCase().includes(search))
      .forEach((attribute) => addSuggestion({ label: attribute.value, type: 'Atributo', hint: attribute.name }));

    return suggestions;
  }

  filterProducts(filters: ProductFilters): Observable<Product[]> {
    const search = filters.search.trim().toLowerCase();

    const filteredProducts = this.products.filter((product) => {
        const matchesSearch =
          !search ||
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.subcategory.toLowerCase().includes(search) ||
          product.attributes.some((attribute) =>
            attribute.name.toLowerCase().includes(search) || attribute.value.toLowerCase().includes(search)
          );
        const matchesCategory = filters.category === 'Todas' || product.category === filters.category;
        const matchesSubcategory = !filters.subcategory || product.subcategory === filters.subcategory;
        const finalPrice = this.getFinalPrice(product);
        const matchesMin = filters.minPrice === null || finalPrice >= filters.minPrice;
        const matchesMax = filters.maxPrice === null || finalPrice <= filters.maxPrice;
        const matchesAttributes = Object.entries(filters.attributes).every(([name, values]) => {
          if (values.length === 0) {
            return true;
          }

          return product.attributes.some((attribute) => attribute.name === name && values.includes(attribute.value));
        });

        return matchesSearch && matchesCategory && matchesSubcategory && matchesMin && matchesMax && matchesAttributes;
      });

    return of(this.sortProducts(filteredProducts, filters.sortBy));
  }

  private sortProducts(products: Product[], sortBy: ProductFilters['sortBy']): Product[] {
    const sortedProducts = [...products];

    if (sortBy === 'priceAsc') {
      return sortedProducts.sort((a, b) => this.getFinalPrice(a) - this.getFinalPrice(b));
    }

    if (sortBy === 'priceDesc') {
      return sortedProducts.sort((a, b) => this.getFinalPrice(b) - this.getFinalPrice(a));
    }

    if (sortBy === 'nameAsc') {
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sortedProducts.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  private getFinalPrice(product: Product): number {
    const discount = product.price * ((product.discountPercentage ?? 0) / 100);
    return product.price - discount;
  }
}
