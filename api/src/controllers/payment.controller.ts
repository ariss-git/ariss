import { Request, Response } from 'express';
import { verifyPaymentService } from '../services/payment.service.js';

export const verifyPaymentController = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Call the verifyPaymentService to verify the payment
        const result = await verifyPaymentService({
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
