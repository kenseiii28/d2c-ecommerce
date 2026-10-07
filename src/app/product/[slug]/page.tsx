import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { ProductDetailView } from '@/components/storefront/ProductDetailView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | DIRTTOWN',
    };
  }

  return {
    title: `${product.name} — ${product.subcategory} Jeans | DIRTTOWN`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Filter similar products from the same subcategory, excluding current product
  const similarProducts = INITIAL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.subcategory === product.subcategory
  ).slice(0, 4);

  // If fewer than 4 similar products in same subcategory, backfill with others
  if (similarProducts.length < 4) {
    const additional = INITIAL_PRODUCTS.filter(
      (p) => p.id !== product.id && !similarProducts.some((sp) => sp.id === p.id)
    ).slice(0, 4 - similarProducts.length);
    similarProducts.push(...additional);
  }

  return <ProductDetailView product={product} similarProducts={similarProducts} />;
}
