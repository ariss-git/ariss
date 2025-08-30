// src/services/back-office.service.ts

import { UserType } from '@prisma/client';
import { prisma } from '../db/prismaSingleton.js';
import { verifyOTP } from './otp.service.js';
import { confirmRegisterBackOffice } from '../lib/confirmRegister.js';

export class BackOfficeService {
    private prismaClient;

    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }

    /**
     * @method registerBackOfficeService
     * @desc Register a new back-office user
     * @param phone User phone number
     * @param email User email
     * @param first_name First name
     * @param last_name Last name
     * @param usertype Type of user (must be BACKOFFICE)
     * @param dealerId Associated dealer ID
     * @param otp One-time password for verification
     * @throws Error if user exists, dealer not found, OTP invalid, or usertype invalid
     */
    async registerBackOfficeService(
        phone: string,
        email: string,
        first_name: string,
        last_name: string,
        usertype: string,
        dealerId: string,
        otp: string
    ) {
        // Check if account exists already
        const existingBackOffice = await this.prismaClient.backOffice.findFirst({
            where: { OR: [{ email }, { phone }] },
        });
        if (existingBackOffice) throw new Error('Back Office account already exists');

        // Validate user type
        const userTypeEnum = usertype as UserType;
        if (!Object.values(UserType).includes(userTypeEnum)) {
            throw new Error(`Invalid user type: ${usertype}`);
        }

        // Validate dealer ID
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id: dealerId },
        });
        if (!existingDealer) throw new Error('Dealer with this ID does not exist');

        // Verify OTP
        if (!(await verifyOTP(email, otp))) throw new Error('Invalid or expired OTP');

        // Notify successful registration
        confirmRegisterBackOffice(phone, first_name, last_name, email);

        // Create back-office user
        return await this.prismaClient.backOffice.create({
            data: {
                phone,
                email,
                first_name,
                last_name,
                usertype: userTypeEnum,
                dealerid: dealerId,
            },
        });
    }

    /**
     * @method isBackOfficeSignedIn
     * @desc Fetch back-office user by ID and return limited fields
     * @param backoffice_id Unique ID of back-office user
     */
    async isBackOfficeSignedIn(backoffice_id: string) {
        return await this.prismaClient.backOffice.findUnique({
            where: { backoffice_id },
            select: {
                backoffice_id: true,
                phone: true,
                email: true,
                first_name: true,
                last_name: true,
                profile_pic: true,
                dealerid: true,
                createdAt: true,
                usertype: true,
                dealer: {
                    select: {
                        business_name: true,
                        shipping_address: true,
                    },
                },
            },
        });
    }

    /**
     * @method approveBackOfficeService
     * @desc Approve a back-office user for a dealer
     * @param dealer_id Dealer ID
     * @param backoffice_id Back-office user ID
     * @throws Error if back-office does not exist
     */
    async approveBackOfficeService(dealer_id: string, backoffice_id: string) {
        const existingBackOffice = await this.prismaClient.backOffice.findUnique({
            where: { backoffice_id, dealerid: dealer_id },
        });
        if (!existingBackOffice) throw new Error('BackOffice do not exist');

        return await this.prismaClient.backOffice.update({
            where: { backoffice_id },
            data: { isApproved: true },
        });
    }

    /**
     * @method getAllApprovedBackOfficesService
     * @desc Fetch all approved back-office users for a dealer
     * @param dealer_id Dealer ID
     * @throws Error if dealer not found
     */
    async getAllApprovedBackOfficesService(dealer_id: string) {
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id },
        });
        if (!existingDealer) throw new Error('Dealer with this ID is not found');

        return await this.prismaClient.backOffice.findMany({
            where: { isApproved: true },
        });
    }

    /**
     * @method getAllDisapprovedBackOfficesService
     * @desc Fetch all disapproved back-office users for a dealer
     * @param dealer_id Dealer ID
     * @throws Error if dealer not found
     */
    async getAllDisapprovedBackOfficesService(dealer_id: string) {
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: { dealer_id },
        });
        if (!existingDealer) throw new Error('Dealer with this ID is not found');

        return await this.prismaClient.backOffice.findMany({
            where: { isApproved: false },
        });
    }

    /**
     * @method disapproveBackOfficeService
     * @desc Disapprove a back-office user for a dealer
     * @param dealer_id Dealer ID
     * @param backoffice_id Back-office user ID
     * @throws Error if back-office does not exist
     */
    async disapproveBackOfficeService(dealer_id: string, backoffice_id: string) {
        const existingBackOffice = await this.prismaClient.backOffice.findUnique({
            where: { backoffice_id, dealerid: dealer_id },
        });
        if (!existingBackOffice) throw new Error('BackOffice do not exist');

        return await this.prismaClient.backOffice.update({
            where: { backoffice_id },
            data: { isApproved: false },
        });
    }

    /**
     * @method getAllBackofficesForDealer
     * @desc Fetch all back-office users (approved and disapproved) for a dealer
     * @param dealer_id Dealer ID
     */
    getAllBackofficesForDealer = async (dealer_id: string) => {
        return await this.prismaClient.backOffice.findMany({
            where: { dealerid: dealer_id },
        });
    };
}
