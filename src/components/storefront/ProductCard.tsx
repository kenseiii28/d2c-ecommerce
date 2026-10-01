'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

import { Product } from '@/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Get currently selected variant
   */
  const activeVariant =
    product.variants?.[selectedVariantIndex] ??
    product.variants?.[0];

  /**
   * Images are now coming directly from:
   *
   * variant.images
   *
   * Example:
   * images: [baggy01WashedBlue]
   */
  const primaryImage = activeVariant?.images?.[0];

  const secondaryImage =
    activeVariant?.images?.[1] ??
    primaryImage;

  /**
   * Change product color / variant
   */
  const handleSwatchClick = (index: number) => {
    setSelectedVariantIndex(index);
    setIsHovered(false);
  };

  /**
   * Don't render a broken image if a product
   * doesn't have an image.
   */
  const hasImage = Boolean(primaryImage);

  return (
    <article className={styles.cardContainer}>

      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div
        className={styles.imageFrame}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/product/${product.slug}`}
          className={styles.imageLink}
          aria-label={`View ${product.name}`}
        >
          {hasImage ? (
            <Image
              src={
                isHovered
                  ? secondaryImage
                  : primaryImage
              }
              alt={`${product.name}${
                activeVariant?.colorName
                  ? ` - ${activeVariant.colorName}`
                  : ''
              }`}
              fill
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                25vw
              "
              className={styles.productImage}
              priority={false}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>No image</span>
            </div>
          )}
        </Link>

        {/* =================================================
            WISHLIST
        ================================================= */}

        <button
          type="button"
          className={`${styles.wishlistBtn} ${
            isWishlisted ? styles.wishlisted : ''
          }`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            setIsWishlisted((current) => !current);
          }}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            fill={
              isWishlisted
                ? 'currentColor'
                : 'none'
            }
          />
        </button>

        {/* =================================================
            CATEGORY
        ================================================= */}

        {product.subcategory && (
          <span className={styles.categoryTag}>
            {product.subcategory}
          </span>
        )}
      </div>

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <div className={styles.details}>

        {/* Product name + price */}
        <div className={styles.titleRow}>

          <Link
            href={`/product/${product.slug}`}
            className={styles.productName}
          >
            {product.name}
          </Link>

          <span className={styles.price}>
            {product.priceFormatted}
          </span>

        </div>

        {/* Selected color */}
        {activeVariant?.colorName && (
          <p className={styles.variantName}>
            {activeVariant.colorName}
          </p>
        )}

        {/* =================================================
            COLOR SWATCHES
        ================================================= */}

        {product.variants &&
          product.variants.length > 1 && (
            <div
              className={styles.swatchGroup}
              aria-label="Available colors"
            >
              {product.variants.map(
                (variant, index) => (
                  <button
                    type="button"
                    key={variant.id}
                    className={`${styles.swatchDot} ${
                      index === selectedVariantIndex
                        ? styles.swatchActive
                        : ''
                    }`}
                    style={{
                      backgroundColor:
                        variant.colorHex || '#222',
                    }}
                    onClick={() =>
                      handleSwatchClick(index)
                    }
                    title={variant.colorName}
                    aria-label={`Select ${variant.colorName}`}
                    aria-pressed={
                      index === selectedVariantIndex
                    }
                  />
                )
              )}
            </div>
          )}

      </div>
    </article>
  );
};

export default ProductCard;
