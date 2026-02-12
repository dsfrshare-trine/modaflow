import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Elegance Fashion',
      slug: 'elegance',
      logoUrl: 'https://picsum.photos/200/100',
      primaryColor: '#6366f1',
      secondaryColor: '#f59e0b',
      categories: JSON.stringify(['Dresses', 'Tops', 'Bottoms', 'Accessories']),
      menuItems: JSON.stringify(['New Arrivals', 'Collections', 'About', 'Contact']),
      checkoutMode: 'WHATSAPP',
      whatsapp: '5511999999999',
      about: 'Premium fashion for the modern woman',
      contactEmail: 'contact@elegance.com',
      phone: '+55 11 99999-9999',
      address: 'São Paulo, SP',
      heroTitle: 'Elevate Your Style',
      heroSubtitle: 'Discover Premium Fashion Collections',
      heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Urban Threads',
      slug: 'urban-threads',
      logoUrl: 'https://picsum.photos/200/101',
      primaryColor: '#1f2937',
      secondaryColor: '#10b981',
      categories: JSON.stringify(['Streetwear', 'Casual', 'Sports', 'Footwear']),
      menuItems: JSON.stringify(['Shop', 'Trends', 'Sale', 'Contact']),
      checkoutMode: 'PIX',
      pixKey: 'urban@pix.com',
      about: 'Contemporary urban fashion',
      contactEmail: 'hello@urbanthreads.com',
      phone: '+55 21 98888-8888',
      address: 'Rio de Janeiro, RJ',
      heroTitle: 'Street Style Redefined',
      heroSubtitle: 'Bold Fashion for Bold Individuals',
      heroImageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
    },
  });

  console.log('✅ Created tenants');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const lojistaPassword = await bcrypt.hash('lojista123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@modaflow.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const lojista1 = await prisma.user.create({
    data: {
      email: 'lojista@elegance.com',
      password: lojistaPassword,
      name: 'Elegance Manager',
      role: 'LOJISTA',
      tenantId: tenant1.id,
    },
  });

  const lojista2 = await prisma.user.create({
    data: {
      email: 'lojista@urbanthreads.com',
      password: lojistaPassword,
      name: 'Urban Manager',
      role: 'LOJISTA',
      tenantId: tenant2.id,
    },
  });

  console.log('✅ Created users');

  const products1 = await prisma.product.createMany({
    data: [
      {
        tenantId: tenant1.id,
        name: 'Silk Evening Dress',
        description: 'Elegant silk dress perfect for special occasions',
        price: 299.99,
        category: 'Dresses',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae',
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        stock: 50,
        minQuantity: 10,
      },
      {
        tenantId: tenant1.id,
        name: 'Designer Blouse',
        description: 'Premium cotton blouse with modern cut',
        price: 89.99,
        category: 'Tops',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1564257577-d18f97c80e3e',
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        stock: 100,
        minQuantity: 15,
      },
      {
        tenantId: tenant1.id,
        name: 'Leather Handbag',
        description: 'Handcrafted Italian leather handbag',
        price: 449.99,
        category: 'Accessories',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
        ]),
        sizes: JSON.stringify(['One Size']),
        stock: 30,
        minQuantity: 5,
      },
    ],
  });

  const products2 = await prisma.product.createMany({
    data: [
      {
        tenantId: tenant2.id,
        name: 'Graphic Tee Collection',
        description: 'Bold graphic tees for street style',
        price: 39.99,
        category: 'Streetwear',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        stock: 200,
        minQuantity: 20,
      },
      {
        tenantId: tenant2.id,
        name: 'Urban Joggers',
        description: 'Comfortable joggers for everyday wear',
        price: 69.99,
        category: 'Casual',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80',
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        stock: 150,
        minQuantity: 25,
      },
      {
        tenantId: tenant2.id,
        name: 'Premium Sneakers',
        description: 'High-quality sneakers for urban lifestyle',
        price: 159.99,
        category: 'Footwear',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        ]),
        sizes: JSON.stringify(['38', '39', '40', '41', '42', '43', '44']),
        stock: 80,
        minQuantity: 10,
      },
    ],
  });

  console.log('✅ Created products');

  const allProducts = await prisma.product.findMany();

  const order1 = await prisma.order.create({
    data: {
      tenantId: tenant1.id,
      customerName: 'Maria Silva',
      customerEmail: 'maria@example.com',
      customerPhone: '+55 11 98765-4321',
      total: 2999.90,
      status: 'PENDING',
      items: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 10,
            price: 299.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      tenantId: tenant2.id,
      customerName: 'João Santos',
      customerEmail: 'joao@example.com',
      customerPhone: '+55 21 97654-3210',
      total: 799.80,
      status: 'PAID',
      items: {
        create: [
          {
            productId: allProducts[3].id,
            quantity: 20,
            price: 39.99,
          },
        ],
      },
    },
  });

  console.log('✅ Created orders');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📝 Test credentials:');
  console.log('   Admin: admin@modaflow.com / admin123');
  console.log('   Lojista 1: lojista@elegance.com / lojista123');
  console.log('   Lojista 2: lojista@urbanthreads.com / lojista123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
