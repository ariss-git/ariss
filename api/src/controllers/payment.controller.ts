// src/controllers/payment.controller.ts

import { Request, Response } from 'express';
import { handleRazorpayWebhookService } from '../services/payment.service.js';

/**
 * Handles the Razorpay webhook event to update payment and order status.
 *
 * @param {Request} req - The HTTP request containing Razorpay webhook payload.
 * @param {Response} res - The HTTP response object.
 */
export const handleRazorpayWebhookController = async (req: Request, res: Response) => {
    try {
        const paymentData = req.body;
        console.log('Webhook Received:', paymentData);

        await handleRazorpayWebhookService(paymentData);

        res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
