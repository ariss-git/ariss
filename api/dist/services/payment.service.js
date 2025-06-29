import Razorpay from 'razorpay';
import { prisma } from '../db/prismaSingleton.js'; // Assuming prismaClient is your Prisma instance
import { config } from '../config/index.js';
// Razorpay instance initialization
const razorpay = new Razorpay({
    key_id: config.razorpayKey, // Store your Razorpay Key ID in .env file
    key_secret: config.razorpaySecret, // Store your Razorpay Key Secret in .env file
});
// Service to verify payment
export const verifyPaymentService = async (paymentDetails) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
    // Step 1: Verify the payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto.createHmac('sha256', config.razorpaySecret).update(body).digest('hex');
    if (expectedSignature !== razorpay_signature) {
        throw new Error('Payment verification failed: Invalid signature');
    }
    // Step 2: Fetch the payment details from Razorpay
    try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        // Step 3: Update payment status in the database
        if (payment.status === 'captured') {
            // Update the payment status to COMPLETED in the database
            await prisma.payment.update({
                where: { payment_id: payment.id }, // Using payment_id or another unique identifier
                data: {
                    status: 'COMPLETED',
                },
            });
            // Update order status to "PROCESSING" (ensure PROCESSING is a valid value in your enum)
            await prisma.order.update({
                where: { order_id: razorpay_order_id }, // Assuming order_id is the unique identifier
                data: {
                    status: 'PROCESSING', // Ensure 'PROCESSING' is a valid enum value for your order status
                },
            });
            return { success: true, message: 'Payment verified successfully' };
        }
        else {
            throw new Error('Payment failed');
        }
    }
    catch (error) {
        throw new Error(`Payment verification failed: ${error.message}`);
    }
};
