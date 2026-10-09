export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  categoryId: string;
  collectionId?: string | null;
  furnitureType: string;
  seatingCapacity?: string | null;
  dimensionsSummary?: string | null;
  widthCm?: number | null;
  depthCm?: number | null;
  heightCm?: number | null;
  seatHeightCm?: number | null;
  frameMaterial?: string | null;
  upholsteryType?: string | null;
  foamDensity?: string | null;
  suspension?: string | null;
  legFinish?: string | null;
  warrantyYears: number;
  isCustomizable: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  indicativePriceRange?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  collection?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images: {
    id: string;
    url: string;
    altText?: string | null;
    viewAngle?: string | null;
    isPrimary: boolean;
  }[];
  specifications: {
    id: string;
    group: string;
    label: string;
    value: string;
  }[];
  threeDAsset?: ThreeDAssetItem | null;
}

export interface ThreeDAssetItem {
  id: string;
  name: string;
  provider: 'POLY_HAVEN' | 'SKETCHFAB' | 'SELF_HOSTED' | string;
  embedMode: 'HOSTED_GLB' | 'SKETCHFAB_EMBED' | string;
  modelUrl: string;
  sketchfabUid?: string | null;
  author: string;
  licence: string;
  attributionUrl: string;
  posterImageUrl?: string | null;
  fileFormat: string;
  loadingStatus: string;
  isAccurateRep: boolean;
  disclaimer?: string | null;
  initialCameraPos?: string | null;
  isEnabled: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  _count?: {
    products: number;
  };
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  heroImage?: string | null;
  isPublished: boolean;
}

export interface CustomDesignFormData {
  referenceType: 'EXISTING_PRODUCT' | 'EXTERNAL_UPLOAD';
  productId?: string;
  productName?: string;
  referenceImages: string[];
  referenceLinks?: string;
  furnitureType: string;
  customizationChecklist: string[];
  customizationDetails: string;
  dimensionsKnown: boolean;
  length?: string;
  depth?: string;
  height?: string;
  seatingCapacity?: string;
  measurementUnit: string;
  fabricPreference: string;
  colorPreference: string;
  framePreference: string;
  foamFirmness: string;
  legFinish: string;
  quantity: number;
  budgetRange?: string;
  intendedUsage: string;
  timeline: string;
  deliveryCity: string;
  deliveryPincode: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  preferredContact: string;
  agreeConsent: boolean;
}
