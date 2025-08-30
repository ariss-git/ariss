// src/middleware/cronjob.middleware.ts
import cron from 'node-cron';
import { DiscountService } from '../services/discount.service.js';
const discountServices = new DiscountService();
cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job: Deleting expired discounts...');
    await discountServices.deleteExpiredDiscountsService();
});
// cron.schedule('*/5 * * * *', async () => {
//     console.log('Running Auto-Dispatch Cron Job...');
//     const processingOrder = await prisma.order.findMany({
//         where: { status: OrderStatus.PROCESSING },
//     });
//     for (const order of processingOrder) {
//         await prisma.order.update({
//             where: { order_id: order.order_id },
//             data: { status: OrderStatus.DISPATCHED },
//         });
//         console.log(`Order ${order.order_id} has been dispatched`);
//     }
// });
