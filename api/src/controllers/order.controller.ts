//src/controllers/order.controller.ts

import { Request, Response } from 'express';
import {
    createOrderService,
    verifyPaymentService,
    updateOrderStatusService,
    cancelOrderService,
    getOrdersService,
} from '../services/order.service.js';
import { OrderStatus, PaymentMode } from '@prisma/client';

/**
 * Handles order creation by calling the service layer.
 * Supports both online payments and credit-based orders.
 *
 * @param {Request} req - The HTTP request object containing order details.
 * @param {Response} res - The HTTP response object.
 */
export const createOrderController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, cart, payment_mode, total_amount } = req.body;

        if (!dealer_id || !cart || !payment_mode || !total_amount) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if (!Object.values(PaymentMode).includes(payment_mode)) {
            return res.status(400).json({ success: false, message: 'Invalid payment mode' });
        }

        const order = await createOrderService({ dealer_id, cart, payment_mode, total_amount });
        return res.status(201).json({ success: true, order });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Verifies Razorpay payment using the provided details.
 * Updates the order status if payment is successful.
 *
 * @param {Request} req - The HTTP request containing Razorpay payment details.
 * @param {Response} res - The HTTP response object.
 */
export const verifyPaymentController = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing payment details' });
        }

        const result = await verifyPaymentService(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Updates the status of an existing order.
 *
 * @param {Request} req - The HTTP request containing the order ID and new status.
 * @param {Response} res - The HTTP response object.
 */
export const updateOrderStatusController = async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params;
        const { status } = req.body;

        if (!order_id || !status) {
            return res.status(400).json({ success: false, message: 'Missing order ID or status' });
        }

        if (!Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        const updatedOrder = await updateOrderStatusService(order_id, status);
        return res.status(200).json({ success: true, order: updatedOrder });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Cancels an order if it is still in the PENDING state.
 *
 * @param {Request} req - The HTTP request containing the order ID.
 * @param {Response} res - The HTTP response object.
 */
export const cancelOrderController = async (req: Request, res: Response) => {
    try {
        const { order_id } = req.params;

        if (!order_id) {
            return res.status(400).json({ success: false, message: 'Missing order ID' });
        }

        const result = await cancelOrderService(order_id);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Retrieves orders based on dealer ID or order ID.
 *
 * @param {Request} req - The HTTP request containing query parameters.
 * @param {Response} res - The HTTP response object.
 */
export const getOrdersController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, order_id } = req.query;
        const orders = await getOrdersService(dealer_id as string, order_id as string);
        return res.status(200).json({ success: true, orders });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
