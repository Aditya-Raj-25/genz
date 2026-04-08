export interface Product {
  _id: string;
  productUrl: string;
  brand: string;
  description: string;
  idProduct: string;
  imageUrl: string;
  categoryByGender: 'Men' | 'Women';
  discountPrice: number;
  originalPrice: number;
  color: string;
  viewCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
}

export interface PriceAlert {
  _id: string;
  product: Product;
  targetPrice: number;
  triggered: boolean;
  createdAt: string;
}

export interface Analytics {
  totalProducts: number;
  trendingCategories: string[];
  topBrands: string[];
}
