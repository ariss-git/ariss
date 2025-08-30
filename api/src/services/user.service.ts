// src/services/user.service.ts

import { prisma } from '../db/prismaSingleton.js';
import { UserType } from '@prisma/client';
import { verifyOTP } from './otp.service.js';
import { generateToken } from '../lib/generateToken.js';

/**
 * @class UserService
 * @desc Service class to handle user-related operations such as login
 */
export class UserService {
    private prismaClient;

    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }

    /**
     * @desc    Handles login logic for DEALER, TECHNICIAN, and BACKOFFICE users
     * @param   {UserType} userType - Type of user logging in
     * @param   {string} phone - Phone number of the user
     * @param   {string} email - Email of the user
     * @param   {string} otp - One-time password for verification
     * @returns {Promise<{token: string, user: any}>} JWT token and user info
     */
    async loginUserService(userType: UserType, phone: string, email: string, otp: string) {
        let user;
        let userId: string;

        switch (userType) {
            case UserType.DEALER:
                user = await this.prismaClient.dealers.findFirst({
                    where: { OR: [{ phone }, { email }] },
                });
                if (!user) throw new Error('Dealer account does not exist');
                if (user.isApproved === false) throw new Error('Dealer is not approved yet...');
                userId = user.dealer_id;
                break;

            case UserType.TECHNICIAN:
                user = await this.prismaClient.technicians.findFirst({
                    where: { OR: [{ phone }, { email }] },
                });
                if (!user) throw new Error('Technician account does not exist');
                if (user.isApproved === false) throw new Error('Technician is not approved yet...');
                userId = user.tech_id;
                break;

            case UserType.BACKOFFICE:
                user = await this.prismaClient.backOffice.findFirst({
                    where: { OR: [{ phone }, { email }] },
                });
                if (!user) throw new Error('Back Office account does not exist');
                if (user.isApproved === false) throw new Error('Back office is not approved yet...');
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
            if (!isVerified) throw new Error('Invalid or expired OTP');
        }

        // Generate JWT token
        const token = generateToken(userId);

        return { token, user };
    }
}
