// src/controllers/dealer.controller.ts

import { config } from '../config/index.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { isDealerSignedIn, registerDealerService } from '../services/dealer.service.js';
import { Request, Response } from 'express';

export const registerDealerController = async (req: Request, res: Response) => {
    try {
        console.log('Incoming Dealer Registration Request:', req.body);

        // Input all these for registration
        const { phone, email, first_name, last_name, otp, gstin, usertype, pncd, loc, dst, st, stcd, adr } =
            req.body;

        // GSTIN API Key check
        const apiKey = config.gstApiKey;
        if (!apiKey) {
            console.error('GST API Key Missing');
            return res.status(500).json({ success: false, message: 'GST API key not found' });
        }

        // Construct shipping_address as an object
        const shipping_address =
            pncd || loc || dst || st || stcd || adr ? { pncd, loc, dst, st, stcd, adr } : null;

        console.log('Shipping Address:', shipping_address);

        // Register Dealer
        const dealer = await registerDealerService(
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

// Controller to check if dealer is logged in
export const isDealerSignedInController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        const dealer = await isDealerSignedIn(req.user.userid);

        if (!dealer) {
            res.status(404).json({ message: 'Dealer not found' });
            return;
        }

        res.status(200).json(dealer);
    } catch (error: any) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
