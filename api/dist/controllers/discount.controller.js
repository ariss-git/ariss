// src/controllers/discount.controller.ts
import { assignDiscountService, deleteExpiredDiscountsService, getAllDiscountsForDealerService, getAllDiscountsService, getSingleDiscount, } from '../services/discount.service.js';
export const assignDiscountController = async (req, res) => {
    try {
        const { dealer_id, product_id, discount_type, expiry_date, amount, percentage } = req.body;
        // Validate required fields
        if (!dealer_id || !product_id || !discount_type || !expiry_date) {
            return res.status(400).json({ success: false, message: 'Missing fields are required' });
        }
        // Ensure correct type for amount and percentage based on discount type
        const parsedAmount = discount_type === 'AMOUNT' ? (amount ? Number(amount) : null) : null;
        const parsedPercentage = discount_type === 'PERCENTAGE' ? (percentage ? Number(percentage) : null) : null;
        // Call service to assign discount
        const discount = await assignDiscountService(dealer_id, product_id, discount_type, expiry_date, parsedAmount, parsedPercentage);
        return res.status(201).json({ success: true, data: discount });
    }
    catch (error) {
        console.error(error); // Log the error for better visibility
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to fetch all discounts
export const getAllDiscountsController = async (_req, res) => {
    try {
        const discounts = await getAllDiscountsService();
        return res.status(200).json({ success: true, total: discounts.length, data: discounts });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to delete single discount
export const getSingleDiscountController = async (req, res) => {
    try {
        const { discount_id } = req.params;
        if (!discount_id) {
            return res.status(404).json({ success: false, message: 'Discount ID is invalid' });
        }
        const discount = await getSingleDiscount(discount_id);
        return res.status(200).json({ success: true, data: discount });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to delete discount manually, if Cronjob fails
export const deleteExpiredDiscountsController = async (_req, res) => {
    try {
        await deleteExpiredDiscountsService();
        return res.status(200).json({ success: true, message: 'Coupon code is successfully expired' });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to get all discounts for a dealer
export const getAllDiscountsForDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            return res.status(404).json({ success: false, message: 'Dealer with this ID is not found' });
        }
        const discounts = await getAllDiscountsForDealerService(dealer_id);
        return res.status(200).json({ success: true, total: discounts.length, data: discounts });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
