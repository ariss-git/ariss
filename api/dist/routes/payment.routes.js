// src/routes/payment.routes.ts
import { Router } from 'express';
import * as paymentControllers from '../controllers/payment.controller.js';
const paymentRoutes = Router();
// @route   POST /verify
// @desc    Route to verify Razorpay payment
paymentRoutes.post('/verify', paymentControllers.verifyPaymentController);
export default paymentRoutes;
