// src/services/order.service.ts
import Razorpay from 'razorpay';
import { prisma } from '../db/prismaSingleton.js'; // Prisma client instance
import { config } from '../config/index.js';
import { PaymentMode } from '@prisma/client'; // PaymentMode enum
// Initialize Razorpay instance with API keys from environment
const razorpay = new Razorpay({
    key_id: config.razorpayKey,
    key_secret: config.razorpaySecret,
});
export class OrderService {
    prismaClient;
    // Service layer class to handle order creation and payment integration
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }
    /**
     * @desc    Service to create an order and integrate Razorpay payment if online
     * @param   orderDetails - Order payload including user, product, amount, and payment info
     * @returns Object containing created order and Razorpay order if applicable
     */
    async createOrderService(orderDetails) {
        const { username, usertype, business_name, shipping_address, product_id, total_amount, quantity, coupon_code, delivery_date, payment_mode, } = orderDetails;
        // Step 1: Insert order into the database
        const order = await this.prismaClient.order.create({
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
        // Step 2: Generate Razorpay order for online payment
        if (payment_mode === PaymentMode.ONLINE) {
            try {
                const razorpayOrder = await razorpay.orders.create({
                    amount: total_amount * 100, // Convert INR to paise
                    currency: 'INR',
                    receipt: order.order_id,
                    notes: { order_id: order.order_id },
                });
                // Step 3: Save Razorpay transaction details in database
                await this.prismaClient.payment.create({
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
        // Return order object if payment is not online
        return { order };
    }
}
