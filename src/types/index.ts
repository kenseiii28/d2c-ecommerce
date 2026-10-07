import type { StaticImageData } from 'next/image';

export interface ProductColorVariant {
  id: string;
  colorName: string;
  colorHex?: string;
  images: (string | StaticImageData)[];
  sizes: {
    size: string;
    stock: number;
    sku: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;       // e.g. "Jeans"
  subcategory: string;    // e.g. "Baggy", "Wide-leg"
  description: string;
  priceFormatted: string; // e.g. "₹TBD" or "₹2,999"
  priceNumeric?: number;
  isFeatured?: boolean;
  variants: ProductColorVariant[];
}

export interface FilterOptions {
  subcategory?: string;
  color?: string;
  size?: string;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'newest';
}
