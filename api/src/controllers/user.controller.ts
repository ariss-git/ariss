// src/controllers/user.controller.ts

import { loginUserService } from '../services/user.service.js';
import { UserType } from '@prisma/client';
import { Request, Response } from 'express';

// Controller to login users
export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { userType, phone, email, otp } = req.body;

        // Ensure userType is a valid enum value
        if (!Object.values(UserType).includes(userType)) {
            return res.status(400).json({ success: false, message: 'Invalid user type' });
        }

        const { token, user } = await loginUserService(userType as UserType, phone, email, otp);

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

// Controller to logout user
export const logoutUserController = async (_req: Request, res: Response) => {
    res.clearCookie('token');
    return res.status(200).json({ success: true, message: 'User logged out successfully' });
};
