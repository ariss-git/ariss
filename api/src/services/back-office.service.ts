// src/services/back-office.service.ts

import { UserType } from '@prisma/client';
import { prisma } from '../db/prismaSingleton.js';
import { verifyOTP } from './otp.service.js';
import { confirmRegisterBackOffice } from '../lib/confirmRegister.js';

// Service to Register Back Office
export const registerBackOfficeService = async (
    phone: string,
    email: string,
    first_name: string,
    last_name: string,
    usertype: string,
    dealerId: string,
    otp: string
) => {
    // Check if Back Office account exists already
    const existingBackOffice = await prisma.backOffice.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existingBackOffice) throw new Error('Back Office account already exists');

    // Setting proper type for Enum
    const userTypeEnum = usertype as UserType;
    if (!Object.values(UserType).includes(userTypeEnum)) {
        throw new Error(`Invalid user type: ${usertype}`);
    }

    // Verify dealer id
    const existingDealer = await prisma.dealers.findUnique({
        where: {
            dealer_id: dealerId,
        },
    });

    if (!existingDealer) throw new Error('Dealer with this ID does not exist');

    // Verify OTP before register
    if (!(await verifyOTP(email, otp))) throw new Error('Invalid or expired OTP');

    confirmRegisterBackOffice(phone, first_name, last_name, email);

    // Register Back Office
    return await prisma.backOffice.create({
        data: {
            phone,
            email,
            first_name,
            last_name,
            usertype: userTypeEnum,
            dealerid: dealerId,
        },
    });
};

// Service to verify Back Office is logged in
export const isBackOfficeSignedIn = async (backoffice_id: string) => {
    return await prisma.backOffice.findUnique({
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
        },
    });
};

// Service to approve a back office
export const approveBackOfficeService = async (dealer_id: string, backoffice_id: string) => {
    const existingBackOffice = await prisma.backOffice.findUnique({
        where: { backoffice_id, dealerid: dealer_id },
    });

    if (!existingBackOffice) throw new Error('BackOffice do not exist');

    return await prisma.backOffice.update({
        where: {
            backoffice_id,
        },
        data: {
            isApproved: true,
        },
    });
};

// Service to fetch all approved back-offices
export const getAllApprovedBackOfficesService = async (dealer_id: string) => {
    const existingDealer = await prisma.dealers.findUnique({
        where: {
            dealer_id,
        },
    });
    if (!existingDealer) throw new Error('Dealer with this ID is not found');

    return await prisma.backOffice.findMany({
        where: {
            isApproved: true,
        },
    });
};

// Service to fetch all not-approved back-offices
export const getAllDisapprovedBackOfficesService = async (dealer_id: string) => {
    const existingDealer = await prisma.dealers.findUnique({
        where: {
            dealer_id,
        },
    });
    if (!existingDealer) throw new Error('Dealer with this ID is not found');

    return await prisma.backOffice.findMany({
        where: {
            isApproved: false,
        },
    });
};

// Service to disapprove a back office
export const disapproveBackOfficeService = async (dealer_id: string, backoffice_id: string) => {
    const existingBackOffice = await prisma.backOffice.findUnique({
        where: { backoffice_id, dealerid: dealer_id },
    });

    if (!existingBackOffice) throw new Error('BackOffice do not exist');

    return await prisma.backOffice.update({
        where: {
            backoffice_id,
        },
        data: {
            isApproved: false,
        },
    });
};

// Service to fetch all backoffices for a dealer
export const getAllBackofficesForDealer = async (dealer_id: string) => {
    return await prisma.backOffice.findMany({
        where: {
            dealerid: dealer_id,
        },
    });
};
