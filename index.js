import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import authenticateToken from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bosta Library Management System API!' });
});

(async () => {
  try {
    const authRoutes = await import('./Routes/auth.js');
    app.use('/api/auth', authRoutes.default);

    const bookRoutes = await import('./Routes/book.js');
    app.use('/api/books', bookRoutes.default);

    const borrowerRoutes = await import('./Routes/borrower.js');
    app.use('/api/borrowers', authenticateToken, borrowerRoutes.default);

    const checkoutRoutes = await import('./Routes/checkout.js');
    app.use('/api/checkouts', authenticateToken, checkoutRoutes.default);

    const exportRoutes = await import('./Routes/export.js');
    app.use('/api/exports', authenticateToken, exportRoutes.default);

    const jobRoutes = await import('./Routes/job.js');
    app.use('/api/jobs', authenticateToken, jobRoutes.default);
  } catch (err) {
    console.error('Failed to load routes:', err);
    process.exit(1);
  }
})();

app.use(errorHandler);

(async () => {
  try {
    const { startCronJobs } = await import('./jobs/cron.js');
    startCronJobs();
  } catch (err) {
    console.error('Failed to start cron jobs:', err);
  }
})();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  const { getPrismaClient } = await import('./config/database.js');
  const prisma = getPrismaClient();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  const { getPrismaClient } = await import('./config/database.js');
  const prisma = getPrismaClient();
  await prisma.$disconnect();
  process.exit(0);
});
