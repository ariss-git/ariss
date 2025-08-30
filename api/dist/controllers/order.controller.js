// src/controllers/order.controller.ts
import { OrderService } from '../services/order.service.js';
const orderServices = new OrderService();
// @desc    Controller to create a new order
// @route   POST /create
export const createOrderController = async (req, res) => {
    try {
        // Extract order details from the request body
        const orderDetails = req.body;
        // Call the service layer to create the order
        const result = await orderServices.createOrderService(orderDetails);
        return res.status(200).json({
            success: true,
            message: 'Order created successfully',
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
