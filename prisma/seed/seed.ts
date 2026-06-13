import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // 1. Create Default Roles
    const adminRole = await prisma.userRole.upsert({
      where: { slug: 'admin' },
      update: {},
      create: {
        name: 'Administrator',
        slug: 'admin',
        description: 'Super user with full system access',
      },
    });

    await prisma.userRole.upsert({
      where: { slug: 'user' },
      update: {},
      create: {
        name: 'User',
        slug: 'user',
        description: 'Standard registered user',
      },
    });

    console.log('🌱 Roles seeded successfully');

    // 2. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@archicopro.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminFirstName = 'Super';
    const adminLastName = 'Admin';
    const adminHashed = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash: adminHashed,
        firstName: adminFirstName,
        lastName: adminLastName,
        roleId: adminRole.id,
        isSuperuser: true,
        status: 'active',
        isEmailVerified: true,
      },
      create: {
        email: adminEmail,
        passwordHash: adminHashed,
        firstName: adminFirstName,
        lastName: adminLastName,
        roleId: adminRole.id,
        isSuperuser: true,
        status: 'active',
        isEmailVerified: true,
      },
    });
    console.log('🌱 Admin user seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
// eslint-disable-next-line @typescript-eslint/no-floating-promises
seedUsers();
