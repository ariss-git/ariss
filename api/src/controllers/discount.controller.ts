// src/controllers/discount.controller.ts

import { DiscountService } from '../services/discount.service.js';
import { Request, Response } from 'express';

const discountServices = new DiscountService();

/**
 * @desc      Assign a discount to a dealer
 * @route     POST /
 * @access    Public
 */
export const assignDiscountController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, product_id, discount_type, expiry_date, amount, percentage } = req.body;

        if (!dealer_id || !product_id || !discount_type || !expiry_date) {
            return res.status(400).json({ success: false, message: 'Missing fields are required' });
        }

        const parsedAmount = discount_type === 'AMOUNT' ? (amount ? Number(amount) : null) : null;
        const parsedPercentage =
            discount_type === 'PERCENTAGE' ? (percentage ? Number(percentage) : null) : null;

        const discount = await discountServices.assignDiscountService(
            dealer_id,
            product_id,
            discount_type,
            expiry_date,
            parsedAmount,
            parsedPercentage
        );

        return res.status(201).json({ success: true, data: discount });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Fetch all discounts
 * @route     GET /
 * @access    Public
 */
export const getAllDiscountsController = async (_req: Request, res: Response) => {
    try {
        const discounts = await discountServices.getAllDiscountsService();

        return res.status(200).json({ success: true, total: discounts.length, data: discounts });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Fetch a single discount by ID
 * @route     DELETE /:discount_id
 * @access    Public
 */
export const getSingleDiscountController = async (req: Request, res: Response) => {
    try {
        const { discount_id } = req.params;

        if (!discount_id) {
            return res.status(404).json({ success: false, message: 'Discount ID is invalid' });
        }

        const discount = await discountServices.getSingleDiscount(discount_id);

        return res.status(200).json({ success: true, data: discount });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Manually delete expired discounts (fallback if Cron fails)
 * @route     DELETE /
 * @access    Public
 */
export const deleteExpiredDiscountsController = async (_req: Request, res: Response) => {
    try {
        await discountServices.deleteExpiredDiscountsService();

        return res.status(200).json({ success: true, message: 'Coupon code is successfully expired' });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Fetch all discounts for a specific dealer
 * @route     GET /app/:dealer_id
 * @access    Public
 */
export const getAllDiscountsForDealerController = async (req: Request, res: Response) => {
    try {
        const { dealer_id } = req.params;

        if (!dealer_id) {
            return res.status(404).json({ success: false, message: 'Dealer with this ID is not found' });
        }

        const discounts = await discountServices.getAllDiscountsForDealerService(dealer_id);
        return res.status(200).json({ success: true, total: discounts.length, data: discounts });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
