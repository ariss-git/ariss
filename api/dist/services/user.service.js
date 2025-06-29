// src/services/user.service.ts
import { prisma } from '../db/prismaSingleton.js';
import { UserType } from '@prisma/client';
import { verifyOTP } from './otp.service.js';
import { generateToken } from '../lib/generateToken.js';
// Service to login users
export const loginUserService = async (userType, phone, email, otp) => {
    let user;
    let userId;
    switch (userType) {
        case UserType.DEALER:
            user = await prisma.dealers.findFirst({
                where: { OR: [{ phone }, { email }] },
            });
            if (!user)
                throw new Error('Dealer account does not exist');
            if (user.isApproved === false)
                throw new Error('Dealer is not approved yet...');
            userId = user.dealer_id;
            break;
        case UserType.TECHNICIAN:
            user = await prisma.technicians.findFirst({
                where: { OR: [{ phone }, { email }] },
            });
            if (!user)
                throw new Error('Technician account does not exist');
            if (user.isApproved === false)
                throw new Error('Technician is not approved yet...');
            userId = user.tech_id;
            break;
        case UserType.BACKOFFICE:
            user = await prisma.backOffice.findFirst({
                where: { OR: [{ phone }, { email }] },
            });
            if (!user)
                throw new Error('Back Office account does not exist');
            if (user.isApproved === false)
                throw new Error('Back office is not approved yet...');
            userId = user.backoffice_id;
            break;
        default:
            throw new Error('Invalid user type');
    }
    // Bypass OTP only for the demo App Store account
    const isOtpBypassed = email === 'saadsyed950@gmail.com' && otp === '123456';
    if (!isOtpBypassed) {
        // Verify OTP normally
        const isVerified = await verifyOTP(email, otp);
        if (!isVerified)
            throw new Error('Invalid or expired OTP');
    }
    // Generate JWT
    const token = generateToken(userId);
    return { token, user };
};
