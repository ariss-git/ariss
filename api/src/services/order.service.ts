// src/services/order.service.ts

import { prisma } from '../db/prismaSingleton.js';
import { OrderStatus, PaymentMode, PaymentStatus } from '@prisma/client';
import { razorpay } from '../lib/razorpayClient.js';
import crypto from 'crypto';

interface CreateOrderInput {
    dealer_id: string;
    cart: { product_id: string; quantity: number }[];
    payment_mode: PaymentMode;
    total_amount: number;
}

/**
 * Creates a new order for the dealer.
 * If payment mode is ONLINE, it generates a Razorpay order.
 * If payment mode is CREDIT, it creates a ledger entry.
 *
 * @param {CreateOrderInput} orderData - Order details including dealer ID, cart items, payment mode, and total amount.
 * @returns {Promise<Object>} - The created order details along with Razorpay order (for ONLINE payments) or ledger message (for CREDIT payments).
 */
export const createOrderService = async (orderData: CreateOrderInput) => {
    // Step 1: Create order entries for each product in the cart
    const orders = await Promise.all(
        orderData.cart.map(async (item) => {
            return prisma.order.create({
                data: {
                    dealer_id: orderData.dealer_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    total_amount: orderData.total_amount,
                    status: OrderStatus.PENDING,
                    payment_mode: orderData.payment_mode,
                },
            });
        })
    );

    // Step 2: Handle payment based on the payment mode
    if (orderData.payment_mode === PaymentMode.ONLINE) {
        // Generate Razorpay Order
        const razorpayOrder = await razorpay.orders.create({
            amount: orderData.total_amount * 100, // Convert to paise
            currency: 'INR',
            receipt: orders[0].order_id, // Using the first order ID as reference
            payment_capture: true,
        });

        console.log('Created Razorpay Order:', razorpayOrder);

        return { orders, razorpayOrder }; // Return orders and Razorpay order details
    } else {
        // If Credit Payment, create a ledger entry for tracking due payments
        await prisma.ledger.create({
            data: {
                dealer_id: orderData.dealer_id,
                order_id: orders[0].order_id,
                total_due: orderData.total_amount,
                amount_paid: 0,
                balance_due: orderData.total_amount,
                due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days Credit
            },
        });

        return { orders, message: 'Credit order placed successfully' };
    }
};

/**
 * Verifies Razorpay payment signature to ensure payment authenticity.
 * Updates the order status to PROCESSING upon successful payment.
 *
 * @param {string} razorpay_order_id - The Razorpay order ID generated during checkout.
 * @param {string} razorpay_payment_id - The transaction ID provided by Razorpay.
 * @param {string} razorpay_signature - The HMAC SHA256 signature for verification.
 * @returns {Promise<Object>} - Confirmation message after verifying the payment.
 */
export const verifyPaymentService = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
) => {
    // Step 1: Generate HMAC SHA256 signature using Razorpay Secret
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET as string)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        throw new Error('Invalid payment signature'); // Signature mismatch indicates tampering
    }

    // Step 2: Update order status to PROCESSING
    await prisma.order.updateMany({
        where: { payment_mode: PaymentMode.ONLINE, status: OrderStatus.PENDING },
        data: { status: OrderStatus.PROCESSING },
    });

    // Step 3: Fetch total amount from the order record
    const order = await prisma.order.findUnique({
        where: { order_id: razorpay_order_id },
        select: { total_amount: true },
    });

    // Step 4: Store payment details in the database
    await prisma.payment.create({
        data: {
            order_id: razorpay_order_id,
            transaction_id: razorpay_payment_id,
            amount: order?.total_amount || 0,
            status: PaymentStatus.COMPLETED,
        },
    });

    return { message: 'Payment verified and order moved to PROCESSING' };
};

/**
 * Updates the order status (Processing → Dispatched → Delivered).
 *
 * @param {string} order_id - The ID of the order to update.
 * @param {OrderStatus} status - The new status to be set for the order.
 * @returns {Promise<Object>} - Updated order details.
 */
export const updateOrderStatusService = async (order_id: string, status: OrderStatus) => {
    if (!Object.values(OrderStatus).includes(status)) {
        throw new Error(`Invalid order status: ${status}`);
    }

    return prisma.order.update({
        where: { order_id },
        data: { status },
    });
};

/**
 * Cancels an order if it's still in the PENDING state.
 *
 * @param {string} order_id - The ID of the order to be canceled.
 * @returns {Promise<Object>} - Confirmation message after successful cancellation.
 */
export const cancelOrderService = async (order_id: string) => {
    // Step 1: Check if the order exists and is in PENDING state
    const order = await prisma.order.findUnique({ where: { order_id } });

    if (!order) throw new Error('Order not found');
    if (order.status !== OrderStatus.PENDING) {
        throw new Error('Only pending orders can be canceled');
    }

    // Step 2: Delete the order from the database
    await prisma.order.delete({ where: { order_id } });

    return { message: 'Order cancelled successfully' };
};

/**
 * Fetches orders based on dealer ID or order ID.
 *
 * @param {string} [dealer_id] - (Optional) Filter orders by dealer ID.
 * @param {string} [order_id] - (Optional) Fetch details of a specific order.
 * @returns {Promise<Object[]>} - List of orders matching the criteria.
 */
export const getOrdersService = async (dealer_id?: string, order_id?: string) => {
    const whereClause: any = {};
    if (dealer_id) whereClause.dealer_id = dealer_id;
    if (order_id) whereClause.order_id = order_id;

    return prisma.order.findMany({
        where: whereClause,
        include: { Dealers: true, Product: true, Payment: true, Ledger: true },
    });
};
