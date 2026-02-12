
import { TenantConfig, Product, Order } from './types';

export const MOCK_TENANTS: TenantConfig[] = [
  {
    id: 'tenant-1',
    name: 'Aura Minimalist',
    slug: 'aura-minimalist',
    logoUrl: 'https://picsum.photos/id/10/200/50',
    primaryColor: '#000000',
    secondaryColor: '#f3f4f6',
    categories: ['Tops', 'Bottoms', 'Dresses', 'Accessories'],
    menuItems: ['Catalog', 'New Arrivals', 'Bulk Deals', 'About'],
    settings: {
      checkoutMode: 'WHATSAPP',
      pixKey: 'aura@pix.me'
    },
    institutional: {
      about: 'Born from the desire for simplicity, Aura Minimalist focuses on timeless silhouettes and sustainable fabrics.',
      contactEmail: 'hello@auraminimalist.com',
      phone: '+55 11 98888-7777',
      whatsapp: '5511988887777',
      address: 'Rua Oscar Freire, 1200 - São Paulo, SP'
    },
    banners: {
      heroTitle: 'Essential Wholesale Summer',
      heroSubtitle: 'Premium linen pieces for your retail store.',
      heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070'
    }
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    tenantId: 'tenant-1',
    name: 'Linen Wide-Leg Trousers',
    description: 'Expertly tailored from premium Italian linen.',
    price: 389.00,
    category: 'Bottoms',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=687'],
    sizes: ['S', 'M', 'L'],
    stock: 999,
    minQuantity: 10
  },
  {
    id: 'p2',
    tenantId: 'tenant-1',
    name: 'Silk Bias Cut Dress',
    description: 'A minimalist staple for luxury boutiques.',
    price: 549.00,
    category: 'Dresses',
    images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=686'],
    sizes: ['XS', 'S', 'M'],
    stock: 999,
    minQuantity: 5
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-12345',
    tenantId: 'tenant-1',
    customerName: 'Global Boutique',
    total: 3890.00,
    status: 'PAID',
    createdAt: new Date().toISOString(),
    items: [{ productId: 'p1', quantity: 10, price: 389.00 }]
  }
];
