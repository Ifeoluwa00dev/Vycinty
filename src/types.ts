export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Emoji or SVG lucide name
  color: string; // Tailwind hex or class color for category badge background
  parentId: string | null;
}

export interface OpeningHours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export interface Business {
  id: string;
  ownerId?: string | null;
  name: string;
  slug: string;
  description: string;
  categoryId: string; // Direct category
  city: string; // Ile-Ife
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  instagram?: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  images: string[];
  isPhysical: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  openingHours: OpeningHours;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface BusinessClaim {
  id: string;
  businessId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
