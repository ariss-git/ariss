// src/services/user.service.ts

import { prisma } from '../db/prismaSingleton.js';
import { UserType } from '@prisma/client';
import { verifyOTP } from './otp.service.js';
import { generateToken } from '../lib/generateToken.js';

// Service to login users
export const loginUserService = async (userType: UserType, phone: string, email: string, otp: string) => {
    let user;
    let userId: string;

    switch (userType) {
        case UserType.DEALER:
            user = await prisma.dealers.findFirst({
                where: { OR: [{ phone }, { email }] },
            });
            if (!user) throw new Error('Dealer account does not exist');
            if (user.isApproved === false) throw new Error('Dealer is not approved yet...');
            userId = user.dealer_id; // Explicitly assign userId
            break;

        case UserType.TECHNICIAN:
            user = await prisma.technicians.findFirst({
                where: { OR: [{ phone }, { email }] },
            });
            if (!user) throw new Error('Technician account does not exist');
            if (user.isApproved === false) throw new Error('Technician is not approved yet...');
            userId = user.tech_id; // Explicitly assign userId
            break;

        case UserType.BACKOFFICE:
            user = await prisma.backOffice.findFirst({
                where: { OR: [{ phone }, { email }] },
            });
            if (!user) throw new Error('Back Office account does not exist');
            if (user.isApproved === false) throw new Error('Back office is not approved yet...');
            userId = user.backoffice_id; // Explicitly assign userId
            break;

        default:
            throw new Error('Invalid user type');
    }

    // Verify OTP before login
    if (!(await verifyOTP(email, otp))) throw new Error('Invalid or expired OTP');

    // Generate JWT for authentication
    const token = generateToken(userId);

    return { token, user };
};
