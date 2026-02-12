
export enum UserRole {
  ADMIN = 'ADMIN',
  LOJISTA = 'LOJISTA',
  CUSTOMER = 'CUSTOMER'
}

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  categories: string[]; 
  menuItems: string[]; // Dynamic menu
  settings: {
    checkoutMode: 'WHATSAPP' | 'PIX';
    pixKey?: string;
  };
  institutional: {
    about: string;
    contactEmail: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  banners: {
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
  };
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  stock: number;
  minQuantity: number; // Product-specific minimum
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  tenantId: string;
  customerName: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}
