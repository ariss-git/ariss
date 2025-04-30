// src/routes/order.routes.ts

import express from 'express';
import {
    createOrderController,
    verifyPaymentController,
    updateOrderStatusController,
    cancelOrderController,
    getOrdersController,
} from '../controllers/order.controller.js';

const orderRoutes = express.Router();

/**
 * @route POST /order
 * @description Creates a new order for a dealer.
 * Supports both online payments (via Razorpay) and credit-based orders.
 * @access Public
 */
orderRoutes.post('/', createOrderController);

/**
 * @route POST /order/verify
 * @description Verifies a Razorpay payment and updates order status accordingly.
 * @access Public
 */
orderRoutes.post('/verify', verifyPaymentController);

/**
 * @route PUT /order/:order_id/status
 * @description Updates the status of an existing order (Pending → Processing → Dispatched → Delivered).
 * @access Public
 */
orderRoutes.put('/:order_id/status', updateOrderStatusController);

/**
 * @route DELETE /order/:order_id
 * @description Cancels an order if it's still in the PENDING state.
 * @access Public
 */
orderRoutes.delete('/:order_id', cancelOrderController);

/**
 * @route GET /order
 * @description Retrieves orders based on dealer ID or order ID.
 * @access Public
 */
orderRoutes.get('/', getOrdersController);

export default orderRoutes;
