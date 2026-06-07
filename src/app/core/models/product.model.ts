export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  taxPercentage?: number;
  taxLabel?: string;
  category: ProductCategory;
  subcategory: string;
  attributes: ProductAttribute[];
  image: string;
  images?: string[];
  stock: number;
  variants?: ProductVariant[];
  featured: boolean;
  features: string[];
}

export type ProductCategory = 'Tecnologia' | 'Hogar' | 'Indumentaria' | 'Accesorios';

export type ProductSort = 'featured' | 'priceAsc' | 'priceDesc' | 'nameAsc';

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  options: Record<string, string>;
  stock: number;
}

export interface ProductSearchSuggestion {
  label: string;
  type: 'Producto' | 'Categoria' | 'Subcategoria' | 'Atributo';
  hint?: string;
  productId?: number;
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | 'Todas';
  subcategory: string | null;
  attributes: Record<string, string[]>;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: ProductSort;
}
