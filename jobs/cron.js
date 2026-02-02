import cron from 'node-cron';
import updateOverdueCheckouts from './updateOverdueCheckouts.js';

export function startCronJobs() {
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toISOString()}] Cron job triggered: Updating overdue checkouts`);
    try {
      await updateOverdueCheckouts();
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Cron job error:`, error);
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });

  console.log('Cron jobs started: Overdue checkouts update scheduled for daily at midnight (UTC)');
}

export default startCronJobs;
