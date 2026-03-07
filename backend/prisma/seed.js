/**
 * BREW HAVEN - Database Seeder
 * Run with: npm run prisma:seed
 * This fills the database with sample data for testing
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");
  console.log("─────────────────────────────────");

  // ─────────────────────────────────────────
  // STEP 1 — Clean existing data
  // Order matters due to foreign key constraints
  // ─────────────────────────────────────────
  console.log("🗑️  Cleaning existing data...");

  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Existing data cleared");

  // ─────────────────────────────────────────
  // STEP 2 — Create Users
  // ─────────────────────────────────────────
  console.log("👤 Creating users...");

  const salt = await bcrypt.genSalt(10);

  const adminPassword = await bcrypt.hash("admin123", salt);
  const customerPassword = await bcrypt.hash("customer123", salt);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Brew Haven",
      email: "admin@brewhaven.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "09123456789",
      address: "123 Coffee Street, Manila",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Juan dela Cruz",
      email: "customer@brewhaven.com",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "09987654321",
      address: "456 Brew Avenue, Quezon City",
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`✅ Customer created: ${customer.email}`);

  // ─────────────────────────────────────────
  // STEP 3 — Create Categories
  // ─────────────────────────────────────────
  console.log("📂 Creating categories...");

  const drinksCategory = await prisma.category.create({
    data: {
      name: "Drinks",
      slug: "drinks",
      description: "Hot and cold coffee drinks, lattes, and specialty beverages",
    },
  });

  const beansCategory = await prisma.category.create({
    data: {
      name: "Beans",
      slug: "beans",
      description: "Single origin and blended whole bean coffees",
    },
  });

  const pastriesCategory = await prisma.category.create({
    data: {
      name: "Pastries",
      slug: "pastries",
      description: "Freshly baked pastries and snacks",
    },
  });

  console.log("✅ 3 categories created");

  // ─────────────────────────────────────────
  // STEP 4 — Create Products
  // ─────────────────────────────────────────
  console.log("☕ Creating products...");

  const products = await Promise.all([

    // ── DRINKS ──────────────────────────────
    prisma.product.create({
      data: {
        name: "Signature Espresso",
        description: "Our house espresso blend — dark roasted single-origin beans pulled to perfection. Rich crema, notes of dark chocolate and toasted walnut.",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80",
        badge: "Bestseller",
        stock: 100,
        available: true,
        categoryId: drinksCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Honey Oat Latte",
        description: "Silky oat milk steamed to velvet perfection, a drizzle of wildflower honey, and our medium roast espresso. Comfort in a cup.",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
        badge: "Fan Favorite",
        stock: 100,
        available: true,
        categoryId: drinksCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Cold Brew Reserve",
        description: "Steeped 20 hours in cold filtered water. Smooth, bold, never bitter. Served over hand-chipped ice.",
        price: 5.50,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80",
        badge: "Cold",
        stock: 80,
        available: true,
        categoryId: drinksCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Matcha Cloud",
        description: "Ceremonial grade matcha whisked into frothy oat milk. Earthy, sweet, and impossibly smooth.",
        price: 5.75,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80",
        badge: "New",
        stock: 90,
        available: true,
        categoryId: drinksCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Seasonal Pourover",
        description: "Ask your barista what's on today. Rotating single-origins brewed with precision. A different experience every visit.",
        price: 7.00,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
        badge: "Seasonal",
        stock: 60,
        available: true,
        categoryId: drinksCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Cardamom Rose Latte",
        description: "House-made cardamom syrup, rose water, and steamed whole milk. Fragrant, warming, and utterly unique.",
        price: 6.25,
        image: "https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=400&q=80",
        badge: "Specialty",
        stock: 75,
        available: true,
        categoryId: drinksCategory.id,
      },
    }),

    // ── BEANS ───────────────────────────────
    prisma.product.create({
      data: {
        name: "Ethiopia Yirgacheffe",
        description: "Single-origin light roast. Floral jasmine notes, bright citrus finish, and a clean winey sweetness. 250g whole bean.",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1587734195342-6d6c43f5c7c2?w=400&q=80",
        badge: "Single Origin",
        stock: 50,
        available: true,
        categoryId: beansCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Dark Blend No. 7",
        description: "Our signature espresso blend. Full body, low acidity. Notes of dark chocolate, brown sugar, and cedar. 250g whole bean.",
        price: 16.00,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
        badge: "House Blend",
        stock: 60,
        available: true,
        categoryId: beansCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Guatemala Huehuetenango",
        description: "Medium roast from the high-altitude farms of western Guatemala. Brown sugar sweetness, apple tartness, silky body. 250g.",
        price: 17.50,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80",
        badge: "Limited",
        stock: 40,
        available: true,
        categoryId: beansCategory.id,
      },
    }),

    // ── PASTRIES ────────────────────────────
    prisma.product.create({
      data: {
        name: "Almond Croissant",
        description: "Buttery laminated dough filled with frangipane and topped with toasted almond flakes. Baked fresh every morning.",
        price: 4.25,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
        badge: "Fresh Daily",
        stock: 30,
        available: true,
        categoryId: pastriesCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Chocolate Kouign-Amann",
        description: "Caramelized Breton pastry swirled with Valrhona dark chocolate. Crispy exterior, molten center.",
        price: 4.75,
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80",
        badge: "Chef's Pick",
        stock: 25,
        available: true,
        categoryId: pastriesCategory.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Lemon Ricotta Scone",
        description: "Light, tender scone made with fresh ricotta and Meyer lemon zest. Finished with a simple lemon glaze.",
        price: 3.75,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
        badge: "Baked Fresh",
        stock: 35,
        available: true,
        categoryId: pastriesCategory.id,
      },
    }),

  ]);

  console.log(`✅ ${products.length} products created`);

  // ─────────────────────────────────────────
  // STEP 5 — Create Cart for customer
  // ─────────────────────────────────────────
  console.log("🛒 Creating customer cart...");

  await prisma.cart.create({
    data: { userId: customer.id },
  });

  console.log("✅ Customer cart created");

  // ─────────────────────────────────────────
  // STEP 6 — Create Sample Order
  // ─────────────────────────────────────────
  console.log("📦 Creating sample order...");

  const sampleOrder = await prisma.order.create({
    data: {
      userId: customer.id,
      status: "COMPLETED",
      total: 16.25,
      shippingAddress: "456 Brew Avenue, Quezon City",
      note: "Extra hot please!",
      items: {
        create: [
          {
            productId: products[0].id,  // Signature Espresso
            quantity: 2,
            price: products[0].price,
          },
          {
            productId: products[6].id,  // Almond Croissant
            quantity: 1,
            price: products[9].price,
          },
        ],
      },
    },
  });

  console.log(`✅ Sample order created: #${sampleOrder.id}`);

  // ─────────────────────────────────────────
  // DONE
  // ─────────────────────────────────────────
  console.log("─────────────────────────────────");
  console.log("🎉 Database seeded successfully!");
  console.log("─────────────────────────────────");
  console.log("📋 Login Credentials:");
  console.log("   Admin:");
  console.log("   Email:    admin@brewhaven.com");
  console.log("   Password: admin123");
  console.log("");
  console.log("   Customer:");
  console.log("   Email:    customer@brewhaven.com");
  console.log("   Password: customer123");
  console.log("─────────────────────────────────");
}

// Run the seed function
main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });