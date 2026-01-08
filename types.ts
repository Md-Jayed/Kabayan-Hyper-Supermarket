
export type Language = 'en' | 'ar';

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  category: string; // Changed to string for dynamic support
  image: string;
  unit: string;
  stock: number;
  isOffer: boolean;
  descriptionEn: string;
  descriptionAr: string;
}

export interface CategoryItem {
  id: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
}

export type Category = string;

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
  paymentMethod: 'Mada' | 'Visa' | 'ApplePay' | 'COD';
}

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}
