import { Product } from '@/types';

// ============================================================
// LOCAL PRODUCT IMAGES
// ============================================================

import baggy01RawIndigo from './baggy-01-raw-indigo.jpg';
import baggy01VintageBlack from './baggy-01-vintage-black.jpg';
import baggy01WashedBlue from './baggy-01-washed-blue.jpg';

import baggy02BleachTint from './baggy-02-bleach-tint.jpg';
import baggy02CharcoalWash from './baggy-02-charcoal-wash.jpg';

import baggy03DirtySand from './baggy-03-dirty-sand.jpg';

import baggy04WashedBlack from './baggy-04-washed-black.jpg';

import baggy05FadedGrey from './baggy-05-faded-grey.jpg';

import wide01DarkIndigo from './wide-01-dark-indigo.jpg';
import wide01OliveWash from './wide-01-olive-wash.jpg';

import wide02DeepBlack from './wide-02-deep-black.jpg';

import wide03CheetahPrint from './wide-03-cheetah-print.jpg';

import wide04SunLightWash from './wide-04-sun-light-wash.jpg';

import wide05DarkRinse from './wide-05-dark-rinse.jpg';


// ============================================================
// PRODUCTS
// ============================================================

export const INITIAL_PRODUCTS: Product[] = [

  // ==========================================================
  // BAGGY JEANS
  // ==========================================================

  {
    id: 'prod-baggy-01',
    name: 'Baggy 01',
    slug: 'baggy-01-washed-blue',
    category: 'Jeans',
    subcategory: 'Baggy',

    description:
      'Relaxed baggy fit jean crafted from heavy 13oz cotton denim with a classic washed blue finish and low waist profile.',

    priceFormatted: '₹TBD',
    isFeatured: true,

    variants: [
      {
        id: 'var-b1-blue',
        colorName: 'Washed Blue',
        colorHex: '#5b7c99',

        images: [baggy01WashedBlue],

        sizes: [
          { size: '28', stock: 15, sku: 'B01-BLU-28' },
          { size: '30', stock: 20, sku: 'B01-BLU-30' },
          { size: '32', stock: 18, sku: 'B01-BLU-32' },
          { size: '34', stock: 12, sku: 'B01-BLU-34' },
          { size: '36', stock: 8, sku: 'B01-BLU-36' },
        ],
      },

      {
        id: 'var-b1-black',
        colorName: 'Vintage Black',
        colorHex: '#222222',

        images: [baggy01VintageBlack],

        sizes: [
          { size: '28', stock: 10, sku: 'B01-BLK-28' },
          { size: '30', stock: 15, sku: 'B01-BLK-30' },
          { size: '32', stock: 15, sku: 'B01-BLK-32' },
          { size: '34', stock: 10, sku: 'B01-BLK-34' },
        ],
      },

      {
        id: 'var-b1-raw',
        colorName: 'Raw Indigo',
        colorHex: '#1b2a47',

        images: [baggy01RawIndigo],

        sizes: [
          { size: '30', stock: 12, sku: 'B01-RAW-30' },
          { size: '32', stock: 14, sku: 'B01-RAW-32' },
          { size: '34', stock: 8, sku: 'B01-RAW-34' },
        ],
      },
    ],
  },


  // ==========================================================
  // BAGGY 02
  // ==========================================================

  {
    id: 'prod-baggy-02',
    name: 'Baggy 02',
    slug: 'baggy-02-charcoal-wash',
    category: 'Jeans',
    subcategory: 'Baggy',

    description:
      'Over-sized slouchy denim trousers featuring subtle distressing along hems and relaxed thigh volume.',

    priceFormatted: '₹TBD',
    isFeatured: true,

    variants: [
      {
        id: 'var-b2-charcoal',
        colorName: 'Charcoal Wash',
        colorHex: '#3a3a3c',

        images: [baggy02CharcoalWash],

        sizes: [
          { size: '28', stock: 12, sku: 'B02-CHR-28' },
          { size: '30', stock: 18, sku: 'B02-CHR-30' },
          { size: '32', stock: 20, sku: 'B02-CHR-32' },
          { size: '34', stock: 15, sku: 'B02-CHR-34' },
        ],
      },

      {
        id: 'var-b2-bleach',
        colorName: 'Bleach Tint',
        colorHex: '#8da8c4',

        images: [baggy02BleachTint],

        sizes: [
          { size: '30', stock: 10, sku: 'B02-BLC-30' },
          { size: '32', stock: 12, sku: 'B02-BLC-32' },
        ],
      },
    ],
  },


  // ==========================================================
  // BAGGY 03
  // ==========================================================

  {
    id: 'prod-baggy-03',
    name: 'Baggy 03',
    slug: 'baggy-03-dirty-sand',
    category: 'Jeans',
    subcategory: 'Baggy',

    description:
      'Streetwear-infused dirty sand tint denim cut in an extra room wide leg silhouette.',

    priceFormatted: '₹TBD',
    isFeatured: false,

    variants: [
      {
        id: 'var-b3-sand',
        colorName: 'Dirty Sand',
        colorHex: '#9e8c75',

        images: [baggy03DirtySand],

        sizes: [
          { size: '28', stock: 8, sku: 'B03-SND-28' },
          { size: '30', stock: 14, sku: 'B03-SND-30' },
          { size: '32', stock: 16, sku: 'B03-SND-32' },
          { size: '34', stock: 10, sku: 'B03-SND-34' },
        ],
      },
    ],
  },


  // ==========================================================
  // BAGGY 04
  // ==========================================================

  {
    id: 'prod-baggy-04',
    name: 'Baggy 04',
    slug: 'baggy-04-washed-black',
    category: 'Jeans',
    subcategory: 'Baggy',

    description:
      'Relaxed baggy jean featuring a washed black finish with reinforced stitching and deep front slash pockets.',

    priceFormatted: '₹TBD',
    isFeatured: false,

    variants: [
      {
        id: 'var-b4-black',
        colorName: 'Washed Black',
        colorHex: '#222222',

        images: [baggy04WashedBlack],

        sizes: [
          { size: '30', stock: 12, sku: 'B04-BLK-30' },
          { size: '32', stock: 15, sku: 'B04-BLK-32' },
          { size: '34', stock: 9, sku: 'B04-BLK-34' },
        ],
      },
    ],
  },


  // ==========================================================
  // BAGGY 05
  // ==========================================================

  {
    id: 'prod-baggy-05',
    name: 'Baggy 05',
    slug: 'baggy-05-faded-grey',
    category: 'Jeans',
    subcategory: 'Baggy',

    description:
      'Heavy stonewash faded grey baggy jeans with clean ankle stack and relaxed hip cut.',

    priceFormatted: '₹TBD',
    isFeatured: false,

    variants: [
      {
        id: 'var-b5-grey',
        colorName: 'Faded Grey',
        colorHex: '#4f5358',

        images: [baggy05FadedGrey],

        sizes: [
          { size: '28', stock: 14, sku: 'B05-GRY-28' },
          { size: '30', stock: 18, sku: 'B05-GRY-30' },
          { size: '32', stock: 16, sku: 'B05-GRY-32' },
          { size: '34', stock: 11, sku: 'B05-GRY-34' },
        ],
      },
    ],
  },


  // ==========================================================
  // WIDE-LEG JEANS
  // ==========================================================

  {
    id: 'prod-wide-01',
    name: 'Wide-Leg 01',
    slug: 'wide-leg-01-dark-indigo',
    category: 'Jeans',
    subcategory: 'Wide-leg',

    description:
      'Relaxed wide-leg denim silhouette with a deep indigo finish and clean minimal waist construction.',

    priceFormatted: '₹TBD',
    isFeatured: true,

    variants: [
      {
        id: 'var-w1-indigo',
        colorName: 'Dark Indigo',
        colorHex: '#263a56',

        images: [wide01DarkIndigo],

        sizes: [
          { size: '28', stock: 10, sku: 'W01-IND-28' },
          { size: '30', stock: 16, sku: 'W01-IND-30' },
          { size: '32', stock: 20, sku: 'W01-IND-32' },
          { size: '34', stock: 14, sku: 'W01-IND-34' },
        ],
      },

      {
        id: 'var-w1-olive',
        colorName: 'Olive Wash',
        colorHex: '#77765c',

        images: [wide01OliveWash],

        sizes: [
          { size: '30', stock: 12, sku: 'W01-OLV-30' },
          { size: '32', stock: 14, sku: 'W01-OLV-32' },
        ],
      },
    ],
  },


  // ==========================================================
  // WIDE-LEG 02
  // ==========================================================

  {
    id: 'prod-wide-02',
    name: 'Wide-Leg 02',
    slug: 'wide-leg-02-deep-black',
    category: 'Jeans',
    subcategory: 'Wide-leg',

    description:
      'Deep pitch-black wide-leg denim featuring minimal tonal stitching and a tailored waist fit.',

    priceFormatted: '₹TBD',
    isFeatured: true,

    variants: [
      {
        id: 'var-w2-black',
        colorName: 'Deep Black',
        colorHex: '#181818',

        images: [wide02DeepBlack],

        sizes: [
          { size: '28', stock: 12, sku: 'W02-BLK-28' },
          { size: '30', stock: 22, sku: 'W02-BLK-30' },
          { size: '32', stock: 19, sku: 'W02-BLK-32' },
          { size: '34', stock: 13, sku: 'W02-BLK-34' },
        ],
      },
    ],
  },


  // ==========================================================
  // WIDE-LEG 03
  // ==========================================================

  {
    id: 'prod-wide-03',
    name: 'Wide-Leg 03',
    slug: 'wide-leg-03-cheetah-print',
    category: 'Jeans',
    subcategory: 'Wide-leg',

    description:
      'Statement wide-leg denim featuring a distinctive cheetah print finish and relaxed silhouette.',

    priceFormatted: '₹TBD',
    isFeatured: false,

    variants: [
      {
        id: 'var-w3-cheetah',
        colorName: 'Cheetah Print',
        colorHex: '#8b7048',

        images: [wide03CheetahPrint],

        sizes: [
          { size: '28', stock: 9, sku: 'W03-CHT-28' },
          { size: '30', stock: 15, sku: 'W03-CHT-30' },
          { size: '32', stock: 13, sku: 'W03-CHT-32' },
        ],
      },
    ],
  },


  // ==========================================================
  // WIDE-LEG 04
  // ==========================================================

  {
    id: 'prod-wide-04',
    name: 'Wide-Leg 04',
    slug: 'wide-leg-04-sun-light-wash',
    category: 'Jeans',
    subcategory: 'Wide-leg',

    description:
      'Clean sun-bleached light wash wide-leg jean designed for effortless everyday wear.',

    priceFormatted: '₹TBD',
    isFeatured: false,

    variants: [
      {
        id: 'var-w4-light',
        colorName: 'Sun Light Wash',
        colorHex: '#9bb8d3',

        images: [wide04SunLightWash],

        sizes: [
          { size: '30', stock: 14, sku: 'W04-LGT-30' },
          { size: '32', stock: 18, sku: 'W04-LGT-32' },
          { size: '34', stock: 10, sku: 'W04-LGT-34' },
        ],
      },
    ],
  },


  // ==========================================================
  // WIDE-LEG 05
  // ==========================================================

  {
    id: 'prod-wide-05',
    name: 'Wide-Leg 05',
    slug: 'wide-leg-05-dark-rinse',
    category: 'Jeans',
    subcategory: 'Wide-leg',

    description:
      'High-waisted wide-leg jean with dark rinse wash and long clean inseam cut.',

    priceFormatted: '₹TBD',
    isFeatured: false,

    variants: [
      {
        id: 'var-w5-dark',
        colorName: 'Dark Rinse',
        colorHex: '#263a56',

        images: [wide05DarkRinse],

        sizes: [
          { size: '28', stock: 11, sku: 'W05-DRK-28' },
          { size: '30', stock: 17, sku: 'W05-DRK-30' },
          { size: '32', stock: 15, sku: 'W05-DRK-32' },
          { size: '34', stock: 12, sku: 'W05-DRK-34' },
        ],
      },
    ],
  },
];
