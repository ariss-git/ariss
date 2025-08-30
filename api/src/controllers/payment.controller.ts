// src/controllers/payment.controller.ts

import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.js';

const paymentServices = new PaymentService();

// @desc    Controller to verify Razorpay payment details sent from the client
// @route   POST /verify
export const verifyPaymentController = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Call the service layer to handle payment verification
        const result = await paymentServices.verifyPaymentService({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ success: false, message: error.message });
    }
};
