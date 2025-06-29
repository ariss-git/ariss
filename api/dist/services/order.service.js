import Razorpay from 'razorpay';
import { prisma } from '../db/prismaSingleton.js'; // Assuming prismaClient is your Prisma instance
import { config } from '../config/index.js';
import { PaymentMode } from '@prisma/client'; // Import PaymentMode enum
// Razorpay instance initialization
const razorpay = new Razorpay({
    key_id: config.razorpayKey, // Store your Razorpay Key ID in .env file
    key_secret: config.razorpaySecret, // Store your Razorpay Key Secret in .env file
});
// Service to create an order and Razorpay payment
export const createOrderService = async (orderDetails) => {
    const { username, usertype, business_name, shipping_address, product_id, total_amount, quantity, coupon_code, delivery_date, payment_mode, } = orderDetails;
    // Step 1: Create order in the database
    const order = await prisma.order.create({
        data: {
            username,
            usertype,
            business_name,
            shipping_address,
            product_id,
            total_amount,
            quantity,
            coupon_code,
            delivery_date,
            payment_mode,
        },
    });
    if (!order) {
        throw new Error('Failed to create the order in the database');
    }
    // Step 2: Generate Razorpay order
    if (payment_mode === PaymentMode.ONLINE) {
        try {
            const razorpayOrder = await razorpay.orders.create({
                amount: total_amount * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
                currency: 'INR',
                receipt: order.order_id,
                notes: {
                    order_id: order.order_id,
                },
            });
            // Step 3: Save Razorpay order details in the database
            await prisma.payment.create({
                data: {
                    order_id: order.order_id,
                    transaction_id: razorpayOrder.id,
                    amount: total_amount,
                    status: 'PENDING',
                },
            });
            return {
                order,
                razorpayOrder,
            };
        }
        catch (error) {
            throw new Error(`Failed to create Razorpay order: ${error.message}`);
        }
    }
    return { order }; // If payment is not online, return only the order details
};
