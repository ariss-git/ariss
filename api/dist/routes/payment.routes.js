import { Router } from 'express';
import { verifyPaymentController } from '../controllers/payment.controller.js';
const paymentRoutes = Router();
// Route for verifying Razorpay payment
paymentRoutes.post('/verify', verifyPaymentController);
export default paymentRoutes;
