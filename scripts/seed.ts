import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@melody-ai.com' },
    update: {},
    create: {
      email: 'admin@melody-ai.com',
      password: adminPassword,
      name: 'Admin',
      role: 'SUPER_ADMIN',
      credits: 999999,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('Demo123!', 12);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@melody-ai.com' },
    update: {},
    create: {
      email: 'demo@melody-ai.com',
      password: demoPassword,
      name: 'Demo User',
      credits: 500,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Demo user created:', demo.email);

  // Create sample songs
  const sampleSongs = [
    {
      title: 'Desert Dreams',
      genre: 'ARABIC',
      mood: 'EPIC',
      language: 'ARABIC',
      voiceType: 'MALE',
      duration: 120,
      status: 'COMPLETED',
      userId: demo.id,
    },
    {
      title: 'Midnight City',
      genre: 'POP',
      mood: 'HAPPY',
      language: 'ENGLISH',
      voiceType: 'FEMALE',
      duration: 180,
      status: 'COMPLETED',
      userId: demo.id,
    },
    {
      title: 'Electric Storm',
      genre: 'EDM',
      mood: 'MOTIVATIONAL',
      language: 'ENGLISH',
      voiceType: 'MALE',
      duration: 90,
      status: 'COMPLETED',
      userId: admin.id,
    },
  ];

  for (const song of sampleSongs) {
    await prisma.song.create({ data: song as any });
  }
  console.log('✅ Sample songs created');

  console.log('🎉 Seeding complete!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
