// src/services/payment.service.ts

import { prisma } from '../db/prismaSingleton.js';
import { PaymentStatus, OrderStatus } from '@prisma/client';

/**
 * Handles Razorpay webhook events to update payment and order status.
 *
 * @param {any} paymentData - The webhook payload received from Razorpay.
 * @returns {Promise<Object>} - Confirmation message after processing the webhook.
 */
export const handleRazorpayWebhookService = async (paymentData: any) => {
    console.log('Processing Razorpay Webhook:', paymentData);

    // Extract payment details from the webhook payload
    const { order_id, payment_id, status } = paymentData.payload.payment.entity;

    if (!order_id || !payment_id || !status) {
        throw new Error('Invalid payment data received');
    }

    // Map Razorpay payment status to internal PaymentStatus enum
    const paymentStatusMap: Record<string, PaymentStatus> = {
        captured: PaymentStatus.COMPLETED,
        failed: PaymentStatus.FAILED,
    };

    const paymentStatus = paymentStatusMap[status] || PaymentStatus.PENDING;

    // Update the payment record in the database
    await prisma.payment.update({
        where: { order_id },
        data: { transaction_id: payment_id, status: paymentStatus },
    });

    // If the payment is successful, update the order status to PROCESSING
    if (paymentStatus === PaymentStatus.COMPLETED) {
        await prisma.order.update({
            where: { order_id },
            data: { status: OrderStatus.PROCESSING },
        });
    }

    // If payment fails, mark the order as CANCELLED
    if (paymentStatus === PaymentStatus.FAILED) {
        await prisma.order.update({
            where: { order_id },
            data: { status: OrderStatus.CANCELLED },
        });
    }

    console.log('Payment and Order Status Updated Successfully');
    return { success: true, message: 'Payment processed' };
};
