// src/controllers/dealer.controller.ts

import { config } from '../config/index.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { DealerService } from '../services/dealer.service.js';
import { Request, Response } from 'express';

const dealerServices = new DealerService();

/**
 * ============================================
 *        REGISTER DEALER CONTROLLER
 * ============================================
 * @desc    Handles new dealer registration
 * @route   POST /dealer/register
 * @access  Public
 */
export const registerDealerController = async (req: Request, res: Response) => {
    try {
        console.log('Incoming Dealer Registration Request:', req.body);

        // Extract required registration details from request body
        const { phone, email, first_name, last_name, otp, gstin, usertype, pncd, loc, dst, st, stcd, adr } =
            req.body;

        // Validate GSTIN API key availability
        const apiKey = config.gstApiKey;
        if (!apiKey) {
            console.error('GST API Key Missing');
            return res.status(500).json({ success: false, message: 'GST API key not found' });
        }

        // Construct optional shipping address object if provided
        const shipping_address =
            pncd || loc || dst || st || stcd || adr ? { pncd, loc, dst, st, stcd, adr } : null;

        console.log('Shipping Address:', shipping_address);

        // Call service layer to register dealer
        const dealer = await dealerServices.registerDealerService(
            phone,
            email,
            first_name,
            last_name,
            gstin,
            usertype,
            shipping_address,
            apiKey,
            otp
        );

        console.log('Dealer Registered Successfully:', dealer);
        return res.status(201).json({ success: true, data: dealer });
    } catch (error: any) {
        console.error('Registration Error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * ============================================
 *     IS DEALER SIGNED-IN CONTROLLER
 * ============================================
 * @desc    Verifies if the dealer is authenticated and returns profile details
 * @route   GET /dealer/profile
 * @access  Private (Requires Authentication)
 */
export const isDealerSignedInController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Ensure user exists in request (validated by middleware)
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        // Fetch dealer details using user ID from token
        const dealer = await dealerServices.isDealerSignedIn(req.user.userid);

        if (!dealer) {
            res.status(404).json({ message: 'Dealer not found' });
            return;
        }

        // Return dealer details if authenticated
        res.status(200).json(dealer);
    } catch (error: any) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
