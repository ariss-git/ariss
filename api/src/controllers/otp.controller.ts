// src/api/controller/otp.controller.ts

import { Request, Response } from 'express';
import { generateOTP, sendOTPEmail, sendOTPWhatsApp, storeOTP } from '../services/otp.service.js';

// Controller to send OTP
export const sendOTPController = async (req: Request, res: Response) => {
    try {
        const { email, phone } = req.body;

        const otp = generateOTP();
        await storeOTP(email, otp);
        await sendOTPEmail(email, otp);
        await sendOTPWhatsApp(phone, otp);

        return res.status(200).json({
            success: true,
            message: [`OTP sent on Whatsapp - ${phone}`, `OTP sent on email - ${email}`],
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
