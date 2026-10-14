import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { ProductDetailView } from '@/components/storefront/ProductDetailView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-generates a static shell for every product slug at build/start time.
// Required in Next.js 16 for Turbopack to properly compile dynamic routes.
export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Product Not Found | DIRTTOWN' };
  }

  return {
    title: `${product.name} — ${product.subcategory} Jeans | DIRTTOWN`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // TypeScript doesn't narrow product as non-null after notFound() because
  // notFound() throws internally. Use non-null assertion to unblock Turbopack.
  const resolvedProduct = product!;

  // Filter similar products from the same subcategory, excluding current product
  const similarProducts = INITIAL_PRODUCTS.filter(
    (p) => p.id !== resolvedProduct.id && p.subcategory === resolvedProduct.subcategory
  ).slice(0, 4);

  // Backfill with other products if fewer than 4 in same subcategory
  if (similarProducts.length < 4) {
    const additional = INITIAL_PRODUCTS.filter(
      (p) =>
        p.id !== resolvedProduct.id &&
        !similarProducts.some((sp) => sp.id === p.id)
    ).slice(0, 4 - similarProducts.length);
    similarProducts.push(...additional);
  }

  return (
    <ProductDetailView product={resolvedProduct} similarProducts={similarProducts} />
  );
}
