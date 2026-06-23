export interface I18nName {
  ru: string;
  uz?: string;
  en?: string;
}

export interface PartCategory {
  _id: string;
  name: I18nName;
  slug: string;
  icon: string;
  order: number;
  level: 1 | 2;
  parentId: string | null;
  hidden?: boolean;
}

export interface PartType {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategory: string | null;
  synonyms: string[];
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  country: string;
  popular: boolean;
}

export interface CarModel {
  _id: string;
  brandId: string;
  name: string;
  slug: string;
}

export interface City {
  _id: string;
  name: I18nName;
  slug: string;
  region: string;
}

export type Condition = 'new' | 'used' | 'contract' | 'original' | 'duplicate';
export type ListingStatus = 'draft' | 'pending' | 'active' | 'sold' | 'rejected' | 'archived';

export interface Listing {
  _id: string;
  title: string;
  description: string;
  oemNumbers: string[];
  condition: Condition;
  manufacturer: string;
  price: { amount: number; currency: string };
  negotiable?: boolean;
  photos: string[];
  city: string;
  delivery: boolean;
  phone: string;
  status: ListingStatus;
  views: number;
  favoritesCount: number;
  isFavorite?: boolean;
  createdAt: string;
  partTypeId?: { _id: string; name: string; slug: string };
  categoryId?: { _id: string; name: I18nName; slug: string };
  sellerId?: {
    _id: string;
    name: string;
    phone: string;
    sellerProfile?: { shopName: string; city: string; verified?: boolean };
  };
  fitment?: {
    brandId?: { _id: string; name: string } | string;
    modelId?: { _id: string; name: string } | string;
  };
}

export type Role = 'buyer' | 'seller' | 'admin' | 'superadmin';

export interface User {
  _id: string;
  id?: string;
  phone: string;
  name: string;
  role: Role;
  sellerProfile?: { shopName: string; city: string; verified?: boolean; avatar?: string };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface Suggestion {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface ConversationItem {
  _id: string;
  listing: {
    _id: string;
    title: string;
    photos: string[];
    price: { amount: number; currency: string };
  } | null;
  other: { _id: string; name: string; shopName?: string } | null;
  lastMessage: { text: string; senderId: string; at: string } | null;
  unread: number;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
