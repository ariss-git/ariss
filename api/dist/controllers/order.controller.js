import { createOrderService } from '../services/order.service.js';
export const createOrderController = async (req, res) => {
    try {
        // Extract order details from the request body
        const orderDetails = req.body;
        // Call the createOrderService to create the order
        const result = await createOrderService(orderDetails);
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
