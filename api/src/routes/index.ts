import { Router } from 'express';

import backOfficeRoutes from './back-office.routes.js';
import customerRoutes from './customer.routes.js';
import dealerRoutes from './dealer.routes.js';
import discountRoutes from './discount.routes.js';
import ledgerRoutes from './ledger.routes.js';
import orderRoutes from './order.routes.js';
import otpRoutes from './otp.router.js';
import paymentRoutes from './payment.routes.js';
import productRoutes from './product.routes.js';
import technicianRoutes from './technician.routes.js';
import userRoutes from './user.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import rmaRoutes from './rma.routes.js';
import courseRoutes from './course.routes.js';
import adminRoutes from './admin.routes.js';
import empRoutes from './employee.routes.js';
import userCourseRoutes from './userCourse.routes.js';

const router = Router();

// Define routes
router.use('/admin', adminRoutes);
router.use('/dealer', dealerRoutes);
router.use('/technician', technicianRoutes);
router.use('/back-office', backOfficeRoutes);
router.use('/products', productRoutes);
router.use('/otp', otpRoutes);
router.use('/customer', customerRoutes);
router.use('/discount', discountRoutes);
router.use('/order', orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/users', userRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/rma', rmaRoutes);
router.use('/course', courseRoutes);
router.use('/user-course', userCourseRoutes);
router.use('/employee', empRoutes);

export default router;
