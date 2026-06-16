import { prisma } from '../lib/prisma';

async function healthCheck() {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  const healthy = Object.values(checks).every(v => v === true);
  
  if (healthy) {
    console.log('✅ Health check passed');
    process.exit(0);
  } else {
    console.error('❌ Health check failed:', checks);
    process.exit(1);
  }
}

healthCheck();
