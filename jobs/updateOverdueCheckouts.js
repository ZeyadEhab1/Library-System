import dotenv from 'dotenv';
import getPrismaClient from '../config/database.js';
import CheckoutService from '../Services/CheckoutService.js';

dotenv.config();

async function updateOverdueCheckouts() {
  try {
    console.log(`[${new Date().toISOString()}] Starting overdue checkouts update job...`);
    
    const prisma = getPrismaClient();
    const checkoutService = new CheckoutService(prisma);
    
    const result = await checkoutService.updateOverdueCheckouts();
    
    console.log(`[${new Date().toISOString()}] Successfully updated ${result.count} checkout(s) to OVERDUE status`);
    
    return result;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error updating overdue checkouts:`, error);
    throw error;
  }
}

const isMainModule = process.argv[1] && process.argv[1].endsWith('updateOverdueCheckouts.js');

if (isMainModule) {
  updateOverdueCheckouts()
    .then((result) => {
      console.log('Job completed successfully:', result);
      const prisma = getPrismaClient();
      prisma.$disconnect();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Job failed:', error);
      const prisma = getPrismaClient();
      prisma.$disconnect();
      process.exit(1);
    });
}

export default updateOverdueCheckouts;
