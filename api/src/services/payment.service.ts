// src/services/payment.service.ts

import Razorpay from 'razorpay';
import { prisma } from '../db/prismaSingleton.js';
import { config } from '../config/index.js';

// Initialize Razorpay instance with API credentials
const razorpay = new Razorpay({
    key_id: config.razorpayKey, // Razorpay Key ID from environment
    key_secret: config.razorpaySecret, // Razorpay Key Secret from environment
});

// Service class handling payment-related operations
export class PaymentService {
    private prismaClient;

    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }

    /**
     * @desc    Verifies a Razorpay payment using order ID, payment ID, and signature
     *          Updates payment and order status in the database upon successful verification
     * @param   paymentDetails Object containing razorpay_order_id, razorpay_payment_id, razorpay_signature
     * @returns Success message if payment is verified
     */
    async verifyPaymentService(paymentDetails: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

        // Step 1: Verify the payment signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', config.razorpaySecret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            throw new Error('Payment verification failed: Invalid signature');
        }

        // Step 2: Fetch payment details from Razorpay
        try {
            const payment = await razorpay.payments.fetch(razorpay_payment_id);

            // Step 3: Update payment status in database if captured
            if (payment.status === 'captured') {
                await this.prismaClient.payment.update({
                    where: { payment_id: payment.id }, // Ensure payment_id is unique
                    data: {
                        status: 'COMPLETED',
                    },
                });

                // Update corresponding order status to PROCESSING
                await this.prismaClient.order.update({
                    where: { order_id: razorpay_order_id },
                    data: {
                        status: 'PROCESSING',
                    },
                });

                return { success: true, message: 'Payment verified successfully' };
            } else {
                throw new Error('Payment failed');
            }
        } catch (error: any) {
            throw new Error(`Payment verification failed: ${error.message}`);
        }
    }
}
