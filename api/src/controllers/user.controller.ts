// src/controllers/user.controller.ts

import { UserService } from '../services/user.service.js';
import { UserType } from '@prisma/client';
import { Request, Response } from 'express';

const userServices = new UserService();

/**
 * @desc    Login a user with phone/email and OTP
 * @route   POST /login
 * @method  POST
 */
export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { userType, phone, email, otp } = req.body;

        // Ensure userType is a valid enum value
        if (!Object.values(UserType).includes(userType)) {
            return res.status(400).json({ success: false, message: 'Invalid user type' });
        }

        const { token, user } = await userServices.loginUserService(userType as UserType, phone, email, otp);

        // Set token in HTTP-only secure cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return res
            .status(200)
            .json({ success: true, token, message: `${user.email}: logged in successfully` });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Logout the currently authenticated user
 * @route   POST /logout
 * @method  POST
 */
export const logoutUserController = async (_req: Request, res: Response) => {
    res.clearCookie('token');
    return res.status(200).json({ success: true, message: 'User logged out successfully' });
};
