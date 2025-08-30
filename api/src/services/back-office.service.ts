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

    // Service method to register a back office user
    async registerBackOfficeService(
        phone: string,
        email: string,
        first_name: string,
        last_name: string,
        usertype: string,
        dealerId: string,
        otp: string
    ) {
        // Check if Back Office account exists already
        const existingBackOffice = await this.prismaClient.backOffice.findFirst({
            where: { OR: [{ email }, { phone }] },
        });
        if (existingBackOffice) throw new Error('Back Office account already exists');

        // Setting proper type for Enum
        const userTypeEnum = usertype as UserType;
        if (!Object.values(UserType).includes(userTypeEnum)) {
            throw new Error(`Invalid user type: ${usertype}`);
        }

        // Verify dealer id
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: {
                dealer_id: dealerId,
            },
        });

        if (!existingDealer) throw new Error('Dealer with this ID does not exist');

        // Verify OTP before register
        if (!(await verifyOTP(email, otp))) throw new Error('Invalid or expired OTP');

        confirmRegisterBackOffice(phone, first_name, last_name, email);

        // Register Back Office
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

    // Service method to verify Back Office is logged in
    async isBackOfficeSignedIn(backoffice_id: string) {
        return await this.prismaClient.backOffice.findUnique({
            where: {
                backoffice_id,
            },
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

    // Service method to approve a back office user
    async approveBackOfficeService(dealer_id: string, backoffice_id: string) {
        const existingBackOffice = await this.prismaClient.backOffice.findUnique({
            where: { backoffice_id, dealerid: dealer_id },
        });

        if (!existingBackOffice) throw new Error('BackOffice do not exist');

        return await this.prismaClient.backOffice.update({
            where: {
                backoffice_id,
            },
            data: {
                isApproved: true,
            },
        });
    }

    // Service method to fetch all approved back offices users
    async getAllApprovedBackOfficesService(dealer_id: string) {
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: {
                dealer_id,
            },
        });
        if (!existingDealer) throw new Error('Dealer with this ID is not found');

        return await this.prismaClient.backOffice.findMany({
            where: {
                isApproved: true,
            },
        });
    }

    // Service method to fetch all not-approved back offices users
    async getAllDisapprovedBackOfficesService(dealer_id: string) {
        const existingDealer = await this.prismaClient.dealers.findUnique({
            where: {
                dealer_id,
            },
        });
        if (!existingDealer) throw new Error('Dealer with this ID is not found');

        return await this.prismaClient.backOffice.findMany({
            where: {
                isApproved: false,
            },
        });
    }

    // Service method to disapprove a back office user
    async disapproveBackOfficeServicea(dealer_id: string, backoffice_id: string) {
        const existingBackOffice = await this.prismaClient.backOffice.findUnique({
            where: { backoffice_id, dealerid: dealer_id },
        });

        if (!existingBackOffice) throw new Error('BackOffice do not exist');

        return await this.prismaClient.backOffice.update({
            where: {
                backoffice_id,
            },
            data: {
                isApproved: false,
            },
        });
    }

    // Service method to fetch all back office users for a dealer
    getAllBackofficesForDealer = async (dealer_id: string) => {
        return await this.prismaClient.backOffice.findMany({
            where: {
                dealerid: dealer_id,
            },
        });
    };
}
