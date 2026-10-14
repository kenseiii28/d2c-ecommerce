'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  X,
  Check,
} from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import styles from './ProductDetailView.module.css';

interface GalleryItem {
  id: string;
  image: StaticImageData | string;
  label: string;
  cropClass?: string;
}

interface ProductDetailViewProps {
  product: Product;
  similarProducts: Product[];
}

const ALL_SIZES = ['28', '30', '32', '34', '36'];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  similarProducts,
}) => {
  // ── States ────────────────────────────────────────────────
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [ctaState, setCtaState] = useState<'idle' | 'adding' | 'added'>('idle');
  const [showSizeError, setShowSizeError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Accordion open/closed states (Core Features open by default)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    features: true,
    description: false,
    shipping: false,
    care: false,
  });

  const activeVariant = useMemo(() => {
    return product.variants?.[selectedVariantIndex] ?? product.variants?.[0];
  }, [product, selectedVariantIndex]);

  // ── Build Gallery Items ───────────────────────────────────
  const galleryItems = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = [];

    // 1. Current variant images
    if (activeVariant?.images?.length) {
      activeVariant.images.forEach((img, idx) => {
        items.push({
          id: `var-${activeVariant.id}-${idx}`,
          image: img,
          label: `${activeVariant.colorName} — View ${idx + 1}`,
        });
      });
    }

    // 2. Add other variants of this product as alternate color views
    product.variants?.forEach((variant, vIdx) => {
      if (vIdx !== selectedVariantIndex && variant.images?.[0]) {
        items.push({
          id: `alt-${variant.id}`,
          image: variant.images[0],
          label: `${variant.colorName} — Alternate Finish`,
        });
      }
    });

    // 3. Editorial detail crops if gallery has fewer than 3 items
    if (items.length < 3 && activeVariant?.images?.[0]) {
      items.push({
        id: `detail-${activeVariant.id}`,
        image: activeVariant.images[0],
        label: 'Denim Texture & Hardware Detail',
        cropClass: styles.detailCrop,
      });
      items.push({
        id: `hem-${activeVariant.id}`,
        image: activeVariant.images[0],
        label: 'Ankle Stack & Hem Silhouette',
        cropClass: styles.hemCrop,
      });
    }

    return items;
  }, [activeVariant, product, selectedVariantIndex]);

  // Ensure active image index stays in bounds
  const currentImageIndex = Math.min(selectedImageIndex, Math.max(0, galleryItems.length - 1));
  const activeGalleryItem = galleryItems[currentImageIndex];

  // ── Handlers ──────────────────────────────────────────────
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handleColorChange = (index: number) => {
    setSelectedVariantIndex(index);
    setSelectedImageIndex(0);

    // Validate size availability in newly selected variant
    const nextVariant = product.variants?.[index];
    if (selectedSize && nextVariant) {
      const sizeObj = nextVariant.sizes?.find((s) => s.size === selectedSize);
      if (!sizeObj || sizeObj.stock <= 0) {
        setSelectedSize(null);
      }
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleWishlistToggle = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    showToast(next ? 'Saved to your wishlist' : 'Removed from wishlist');
  };

  const handleSizeSelect = (size: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      const sizeContainer = document.getElementById('size-selector-group');
      if (sizeContainer) {
        sizeContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (ctaState !== 'idle') return;

    setCtaState('adding');
    setTimeout(() => {
      setCtaState('added');
      showToast(`Added ${product.name} (${activeVariant?.colorName}, Size ${selectedSize}) to bag`);
      setTimeout(() => {
        setCtaState('idle');
      }, 2400);
    }, 600);
  };

  const scrollToSimilar = () => {
    const el = document.getElementById('similar-styles');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close size guide on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sizeGuideOpen) {
        setSizeGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sizeGuideOpen]);

  // Current selected size stock info
  const selectedSizeInfo = useMemo(() => {
    if (!selectedSize) return null;
    return activeVariant?.sizes?.find((s) => s.size === selectedSize) ?? null;
  }, [selectedSize, activeVariant]);

  return (
    <div className={styles.pageWrapper}>
      {/* ── Breadcrumb Bar with Thin Bottom Divider ──────── */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.contentContainer}>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/shop" className={styles.breadcrumbLink}>Shop</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link
              href={`/shop/${product.subcategory.toLowerCase()}`}
              className={styles.breadcrumbLink}
            >
              {product.subcategory} Jeans
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main PDP Layout Container ────────────────────── */}
      <div className={styles.contentContainer}>
        <div className={styles.productGrid}>
          {/* ===================================================
              PRODUCT GALLERY (Vertical Rail + Main Image)
              =================================================== */}
          <div className={styles.galleryContainer}>
            {/* Vertical Thumbnail Rail on the left */}
            {galleryItems.length > 1 && (
              <div className={styles.thumbnailStrip} aria-label="Product thumbnails">
                {galleryItems.map((item, index) => {
                  const isActive = index === currentImageIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.thumbnailBtn} ${isActive ? styles.activeThumbnail : ''}`}
                      onClick={() => handleThumbnailClick(index)}
                      aria-label={item.label}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="72px"
                        className={`${styles.thumbnailImg} ${item.cropClass || ''}`}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Large Main Product Image */}
            <div className={styles.mainImageFrame}>
              {activeGalleryItem ? (
                <Image
                  src={activeGalleryItem.image}
                  alt={`${product.name} - ${activeVariant?.colorName || ''}`}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 55vw"
                  className={`${styles.mainImage} ${activeGalleryItem.cropClass || ''}`}
                />
              ) : (
                <div className={styles.noImage}>No image available</div>
              )}

              {galleryItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className={`${styles.galleryNavBtn} ${styles.galleryNavPrev}`}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className={`${styles.galleryNavBtn} ${styles.galleryNavNext}`}
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <span className={styles.imageCounter}>
                    {currentImageIndex + 1} / {galleryItems.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* ===================================================
              PRODUCT INFORMATION (Exact Visual Hierarchy 1-13)
              =================================================== */}
          <div className={styles.productInfo}>
            {/* 1. Small Category Label + 4. Wishlist Heart Top-Right */}
            <div className={styles.headerRow}>
              <div className={styles.headerLeft}>
                {/* 1. Small category label */}
                <span className={styles.categoryLabel}>
                  {product.subcategory} Jeans · Drop 01
                </span>

                {/* 2. Product title */}
                <h1 className={styles.productName}>{product.name}</h1>

                {/* 3. Price and inclusive-tax text */}
                <div className={styles.priceRow}>
                  <span className={styles.price}>
                    {product.priceFormatted && product.priceFormatted !== '₹TBD'
                      ? product.priceFormatted
                      : '₹2,999'}
                  </span>
                  <span className={styles.taxInclusiveText}>MRP inclusive of all taxes</span>
                </div>
              </div>

              {/* 4. Wishlist heart aligned to the top-right */}
              <button
                type="button"
                className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistActive : ''}`}
                onClick={handleWishlistToggle}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={isWishlisted}
              >
                <Heart
                  size={15}
                  strokeWidth={1.5}
                  fill={isWishlisted ? '#e53935' : 'none'}
                  color={isWishlisted ? '#e53935' : 'currentColor'}
                />
              </button>
            </div>

            {/* Color variants selector (preserved functionality) */}
            {product.variants && product.variants.length > 1 && (
              <div className={styles.colorSection}>
                <div className={styles.colorHeading}>
                  <span>Color:</span> <strong>{activeVariant?.colorName}</strong>
                </div>
                <div className={styles.swatchRow} role="radiogroup" aria-label="Select color">
                  {product.variants.map((variant, index) => {
                    const isSelected = index === selectedVariantIndex;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`${styles.swatchBtn} ${isSelected ? styles.swatchActive : ''}`}
                        onClick={() => handleColorChange(index)}
                        title={variant.colorName}
                        aria-label={`Color ${variant.colorName}`}
                      >
                        <span
                          className={styles.swatchInner}
                          style={{ backgroundColor: variant.colorHex || '#222222' }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. SIZE label and Size Guide button on same row */}
            {/* 6. Horizontal size buttons with thin grey borders */}
            {/* 7. Disabled/out-of-stock sizes styled in light grey with strikethrough */}
            <div id="size-selector-group" className={styles.sizeSection}>
              <div className={styles.sizeHeaderRow}>
                <span className={styles.sizeLabel}>
                  SIZE{selectedSize ? <span className={styles.selectedSizeVal}>: {selectedSize}</span> : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className={styles.sizeGuideBtn}
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className={styles.sizeGrid} role="radiogroup" aria-label="Select waist size">
                {ALL_SIZES.map((size) => {
                  const sizeItem = activeVariant?.sizes?.find((s) => s.size === size);
                  const isAvailable = Boolean(sizeItem && sizeItem.stock > 0);
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={!isAvailable}
                      className={`
                        ${styles.sizeBtn}
                        ${isSelected ? styles.sizeBtnActive : ''}
                        ${!isAvailable ? styles.sizeBtnDisabled : ''}
                      `}
                      onClick={() => handleSizeSelect(size, isAvailable)}
                      title={!isAvailable ? `Size ${size} is out of stock` : `Size ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {showSizeError && (
                <p className={styles.sizeErrorWarning}>
                  Please choose a size to continue.
                </p>
              )}
            </div>

            {/* 8. Star rating and review count (placed under size buttons) */}
            <div className={styles.ratingRow}>
              <span className={styles.stars} aria-hidden="true">★★★★★</span>
              <span className={styles.ratingScore}>4.9</span>
              <span className={styles.ratingDivider}>·</span>
              <span className={styles.ratingCount}>42 Reviews</span>
            </div>

            {/* 9. Stock status on left and shipping estimate on right */}
            <div className={styles.stockShippingRow}>
              <div className={styles.stockStatus}>
                <span className={styles.stockPulseDot} aria-hidden="true" />
                <span>
                  {selectedSizeInfo
                    ? selectedSizeInfo.stock <= 5
                      ? `Only ${selectedSizeInfo.stock} left in stock`
                      : 'In Stock'
                    : 'In Stock'}
                </span>
              </div>
              <div className={styles.shippingEstimate}>
                <Truck size={14} className={styles.shippingIcon} />
                <span>Est. Delivery: 2–4 Business Days</span>
              </div>
            </div>

            {/* 10. Full-width black primary button */}
            <div className={styles.ctaContainer}>
              <button
                type="button"
                className={`
                  ${styles.primaryCta}
                  ${ctaState === 'added' ? styles.primaryCtaAdded : ''}
                `}
                onClick={handleAddToCart}
                aria-label={selectedSize ? `Add ${product.name} to bag` : 'Select a size'}
              >
                {ctaState === 'adding' ? (
                  <span>ADDING TO BAG...</span>
                ) : ctaState === 'added' ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO BAG</span>
                  </>
                ) : selectedSize ? (
                  <span>ADD TO BAG</span>
                ) : (
                  <span>SELECT A SIZE</span>
                )}
              </button>
            </div>

            {/* 11. Three evenly spaced trust/service items beneath the button */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <Truck size={15} className={styles.trustIcon} />
                <span>Free Express Shipping</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={15} className={styles.trustIcon} />
                <span>7-Day Easy Returns</span>
              </div>
              <div className={styles.trustItem}>
                <ShieldCheck size={15} className={styles.trustIcon} />
                <span>100% Cotton Denim</span>
              </div>
            </div>

            {/* 12. VIEW SIMILAR heading and compact product tile */}
            {similarProducts.length > 0 && (
              <div className={styles.viewSimilarBlock}>
                <div className={styles.viewSimilarHeader}>
                  <span className={styles.viewSimilarHeading}>VIEW SIMILAR</span>
                  {similarProducts.length > 1 && (
                    <button
                      type="button"
                      onClick={scrollToSimilar}
                      className={styles.viewAllSimilarBtn}
                    >
                      View all ({similarProducts.length}) &darr;
                    </button>
                  )}
                </div>
                <Link
                  href={`/product/${similarProducts[0].slug}`}
                  className={styles.compactSimilarTile}
                  title={`View ${similarProducts[0].name}`}
                >
                  <div className={styles.compactSimilarThumbFrame}>
                    <Image
                      src={similarProducts[0].variants?.[0]?.images?.[0] || activeGalleryItem?.image}
                      alt={similarProducts[0].name}
                      fill
                      sizes="52px"
                      className={styles.compactSimilarThumbImg}
                    />
                  </div>
                  <div className={styles.compactSimilarInfo}>
                    <span className={styles.compactSimilarTitle}>{similarProducts[0].name}</span>
                    <span className={styles.compactSimilarSub}>
                      {similarProducts[0].subcategory} Jeans · {similarProducts[0].variants?.[0]?.colorName || 'Classic'}
                    </span>
                  </div>
                  <div className={styles.compactSimilarAction}>
                    <span className={styles.compactSimilarPrice}>
                      {similarProducts[0].priceFormatted && similarProducts[0].priceFormatted !== '₹TBD'
                        ? similarProducts[0].priceFormatted
                        : '₹2,999'}
                    </span>
                    <span className={styles.compactSimilarArrow}>&rarr;</span>
                  </div>
                </Link>
              </div>
            )}

            {/* 13. Four full-width accordion rows */}
            <div className={styles.accordionGroup}>
              {/* Row 1: Core Features */}
              <div className={styles.accordionItem}>
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion('features')}
                  aria-expanded={openAccordions.features}
                >
                  <span>Core Features</span>
                  <span
                    className={`${styles.accordionIcon} ${
                      openAccordions.features ? styles.accordionIconOpen : ''
                    }`}
                  >
                    <ChevronDown size={15} />
                  </span>
                </button>
                <div
                  className={`${styles.accordionContent} ${
                    openAccordions.features ? styles.accordionContentOpen : ''
                  }`}
                >
                  <div className={styles.accordionInner}>
                    <div className={styles.accordionBody}>
                      <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>13.5oz Heavyweight 100% ringspun cotton denim</span>
                        </li>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Deep-slouch architectural cut with natural ankle stacking</span>
                        </li>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Signature DTWN oxidized metal buttons & star-stamped rivets</span>
                        </li>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Heavy stonewashed patina with authentic wear finish</span>
                        </li>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Reinforced double-needle chain stitching on high-stress seams</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Description */}
              <div className={styles.accordionItem}>
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion('description')}
                  aria-expanded={openAccordions.description}
                >
                  <span>Description</span>
                  <span
                    className={`${styles.accordionIcon} ${
                      openAccordions.description ? styles.accordionIconOpen : ''
                    }`}
                  >
                    <ChevronDown size={15} />
                  </span>
                </button>
                <div
                  className={`${styles.accordionContent} ${
                    openAccordions.description ? styles.accordionContentOpen : ''
                  }`}
                >
                  <div className={styles.accordionInner}>
                    <div className={styles.accordionBody}>
                      <p>{product.description}</p>
                      <p style={{ marginTop: '0.45rem' }}>
                        Engineered specifically for the Dirttown campaign silhouette. Cut roomy through the hip and thigh, falling cleanly into an effortless, grounded street drape.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Shipping & Returns */}
              <div className={styles.accordionItem}>
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion('shipping')}
                  aria-expanded={openAccordions.shipping}
                >
                  <span>Shipping & Returns</span>
                  <span
                    className={`${styles.accordionIcon} ${
                      openAccordions.shipping ? styles.accordionIconOpen : ''
                    }`}
                  >
                    <ChevronDown size={15} />
                  </span>
                </button>
                <div
                  className={`${styles.accordionContent} ${
                    openAccordions.shipping ? styles.accordionContentOpen : ''
                  }`}
                >
                  <div className={styles.accordionInner}>
                    <div className={styles.accordionBody}>
                      <p><strong>Dispatch:</strong> Orders are packaged in eco-friendly cotton bags and dispatched within 24–48 hours.</p>
                      <p style={{ marginTop: '0.4rem' }}><strong>Transit:</strong> 2–4 business days across all metro cities; 3–6 business days nationwide.</p>
                      <p style={{ marginTop: '0.4rem' }}><strong>Returns:</strong> We offer a 7-day hassle-free reverse pickup window for unworn items with original tags intact.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Care Guide */}
              <div className={styles.accordionItem}>
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion('care')}
                  aria-expanded={openAccordions.care}
                >
                  <span>Care Guide</span>
                  <span
                    className={`${styles.accordionIcon} ${
                      openAccordions.care ? styles.accordionIconOpen : ''
                    }`}
                  >
                    <ChevronDown size={15} />
                  </span>
                </button>
                <div
                  className={`${styles.accordionContent} ${
                    openAccordions.care ? styles.accordionContentOpen : ''
                  }`}
                >
                  <div className={styles.accordionInner}>
                    <div className={styles.accordionBody}>
                      <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Machine wash cold (30°C max) turned inside out</span>
                        </li>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Wash with similar dark denim tones</span>
                        </li>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Do not bleach or tumble dry; line dry in shade</span>
                        </li>
                        <li className={styles.featureItem}>
                          <span className={styles.featureBullet}>—</span>
                          <span>Warm iron on reverse if desired to preserve denim grain</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SIMILAR PRODUCTS SECTION (BOTTOM OF PAGE)
            =================================================== */}
        {similarProducts.length > 0 && (
          <section id="similar-styles" className={styles.similarSection}>
            <div className={styles.similarHeader}>
              <h2 className={styles.similarTitle}>Similar Styles</h2>
              <p className={styles.similarSubtitle}>
                Discover other {product.subcategory.toLowerCase()} fits from Drop 01
              </p>
            </div>
            <div className={styles.similarGrid}>
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ===================================================
          SIZE GUIDE MODAL
          =================================================== */}
      {sizeGuideOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSizeGuideOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 id="size-guide-title" className={styles.modalTitle}>
                Size Guide — {product.subcategory} Fit
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close size guide"
              >
                <X size={18} />
              </button>
            </div>

            <table className={styles.sizeTable}>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Waist</th>
                  <th>Rise</th>
                  <th>Thigh</th>
                  <th>Inseam</th>
                  <th>Leg Opening</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>28</td>
                  <td>29 in</td>
                  <td>11.5 in</td>
                  <td>24 in</td>
                  <td>31.0 in</td>
                  <td>19 in</td>
                </tr>
                <tr>
                  <td>30</td>
                  <td>31 in</td>
                  <td>12.0 in</td>
                  <td>25 in</td>
                  <td>31.5 in</td>
                  <td>20 in</td>
                </tr>
                <tr>
                  <td>32</td>
                  <td>33 in</td>
                  <td>12.5 in</td>
                  <td>26 in</td>
                  <td>32.0 in</td>
                  <td>21 in</td>
                </tr>
                <tr>
                  <td>34</td>
                  <td>35 in</td>
                  <td>13.0 in</td>
                  <td>27 in</td>
                  <td>32.0 in</td>
                  <td>22 in</td>
                </tr>
                <tr>
                  <td>36</td>
                  <td>37 in</td>
                  <td>13.5 in</td>
                  <td>28 in</td>
                  <td>32.5 in</td>
                  <td>23 in</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.sizeGuideNote}>
              <strong>How to Measure:</strong> Measurements are taken flat across garments. Our {product.subcategory.toLowerCase()} cut is designed with an extra room slouch profile. For a classic tailored waist, we recommend ordering one size down.
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          TOAST FEEDBACK
          =================================================== */}
      {toastMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          <Check size={15} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
