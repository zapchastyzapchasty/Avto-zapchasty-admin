import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { auth } from './auth';
import type {
  AuthResponse,
  Brand,
  CarModel,
  ChatMessage,
  City,
  ConversationItem,
  Listing,
  Paginated,
  PartCategory,
  PartType,
  Suggestion,
  User,
} from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export const http = axios.create({ baseURL: API_URL });

http.interceptors.request.use((config) => {
  const token = auth.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const refreshToken = auth.getRefresh();
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    auth.setTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  } catch {
    auth.clear();
    return null;
  }
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (!refreshing) refreshing = doRefresh().finally(() => { refreshing = null; });
      const newToken = await refreshing;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      }
    }
    return Promise.reject(error);
  }
);

export function errMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    return (e.response?.data as { error?: string })?.error || e.message;
  }
  return e instanceof Error ? e.message : 'Xatolik yuz berdi';
}

export interface SearchParams {
  q?: string;
  categoryId?: string;
  partTypeId?: string;
  brandId?: string;
  modelId?: string;
  condition?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'relevance' | 'newest' | 'cheap' | 'expensive';
  page?: number;
  limit?: number;
}

export interface CreateListingBody {
  partTypeId: string;
  title: string;
  description?: string;
  oemNumbers?: string[];
  condition: string;
  manufacturer?: string;
  price: { amount: number; currency: string };
  negotiable?: boolean;
  fitment?: { brandId?: string; modelId?: string };
  photos?: string[];
  city?: string;
  delivery?: boolean;
  phone?: string;
}

export const api = {
  // ===== Auth =====
  login: (phone: string, password: string) =>
    http.post<AuthResponse>('/auth/login', { phone, password }).then((r) => r.data),
  register: (phone: string, password: string, name?: string) =>
    http.post<AuthResponse>('/auth/register', { phone, password, name }).then((r) => r.data),
  me: () => http.get<{ user: User }>('/auth/me').then((r) => r.data.user),
  updateProfile: (body: { name?: string; shopName?: string; city?: string }) =>
    http.patch<{ user: User }>('/auth/me', body).then((r) => r.data.user),
  logout: (refreshToken: string) => http.post('/auth/logout', { refreshToken }).then((r) => r.data),

  // ===== Katalog =====
  categories: () =>
    http.get<{ categories: PartCategory[] }>('/catalog/categories').then((r) => r.data.categories),
  brands: (popular?: boolean) =>
    http
      .get<{ brands: Brand[] }>('/catalog/brands', { params: popular ? { popular: 1 } : {} })
      .then((r) => r.data.brands),
  brandModels: (brandId: string) =>
    http.get<{ models: CarModel[] }>(`/catalog/brands/${brandId}/models`).then((r) => r.data.models),
  subcategories: (categoryId: string) =>
    http
      .get<{ subcategories: PartCategory[] }>(`/catalog/categories/${categoryId}/subcategories`)
      .then((r) => r.data.subcategories),
  categoryPartTypes: (categoryId: string) =>
    http
      .get<{ partTypes: PartType[] }>(`/catalog/categories/${categoryId}/part-types`)
      .then((r) => r.data.partTypes),
  cities: () => http.get<{ cities: City[] }>('/catalog/cities').then((r) => r.data.cities),

  // ===== Qidiruv =====
  search: (params: SearchParams) =>
    http.get<Paginated<Listing>>('/search', { params }).then((r) => r.data),
  suggest: (q: string) =>
    http.get<{ items: Suggestion[] }>('/search/suggest', { params: { q } }).then((r) => r.data.items),

  // ===== E'lonlar =====
  listing: (id: string) =>
    http
      .get<{ listing: Listing; isFavorite: boolean }>(`/listings/${id}`)
      .then((r) => ({ ...r.data.listing, isFavorite: r.data.isFavorite })),
  myListings: () => http.get<{ items: Listing[] }>('/listings/my').then((r) => r.data.items),
  favorites: () => http.get<{ items: Listing[] }>('/listings/favorites/list').then((r) => r.data.items),
  createListing: (body: CreateListingBody) =>
    http.post<{ listing: Listing }>('/listings', body).then((r) => r.data.listing),
  updateListing: (id: string, body: Partial<CreateListingBody>) =>
    http.patch<{ listing: Listing }>(`/listings/${id}`, body).then((r) => r.data.listing),
  deleteListing: (id: string) => http.delete(`/listings/${id}`).then((r) => r.data),
  setListingStatus: (id: string, status: string) =>
    http.patch<{ listing: Listing }>(`/listings/${id}/status`, { status }).then((r) => r.data.listing),
  toggleFavorite: (id: string) =>
    http.post<{ isFavorite: boolean }>(`/listings/${id}/favorite`).then((r) => r.data.isFavorite),

  // ===== Rasm yuklash =====
  uploadImages: async (files: File[]): Promise<string[]> => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const { data } = await http.post<{ urls: string[] }>('/upload/images', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.urls;
  },

  // ===== Chat =====
  conversations: () =>
    http.get<{ items: ConversationItem[] }>('/chat/conversations').then((r) => r.data.items),
  getOrCreateConversation: (listingId: string) =>
    http.post<{ conversationId: string }>('/chat/conversations', { listingId }).then((r) => r.data.conversationId),
  messages: (conversationId: string) =>
    http.get<{ items: ChatMessage[] }>(`/chat/conversations/${conversationId}/messages`).then((r) => r.data.items),
  sendMessage: (conversationId: string, text: string) =>
    http.post<{ message: ChatMessage }>(`/chat/conversations/${conversationId}/messages`, { text }).then((r) => r.data.message),
  markRead: (conversationId: string) =>
    http.post(`/chat/conversations/${conversationId}/read`).then((r) => r.data),
};
