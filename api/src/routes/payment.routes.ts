// src/routes/payment.routes.ts

import express from 'express';
import { handleRazorpayWebhookController } from '../controllers/payment.controller.js';

const paymentRoutes = express.Router();

/**
 * @route POST /payment/webhook
 * @description Handles Razorpay webhook events to update payment and order status.
 * @access Public
 */
paymentRoutes.post('/webhook', handleRazorpayWebhookController);

export default paymentRoutes;
