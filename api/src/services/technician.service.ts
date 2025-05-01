// src/services/technician.service.ts

import { UserType } from '@prisma/client';
import { prisma } from '../db/prismaSingleton.js';
import { verifyOTP } from './otp.service.js';
import { confirmRegisterTechnician } from '../lib/confirmRegister.js';

// Service to Register Technician
export const registerTechinicianService = async (
    phone: string,
    email: string,
    first_name: string,
    last_name: string,
    usertype: string,
    dealerId: string,
    otp: string
) => {
    // Check if Techinian account exists already
    const existingTechnician = await prisma.technicians.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existingTechnician) throw new Error('Techinican account already exists');

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

    confirmRegisterTechnician(phone, first_name, last_name, email);

    // Register techinician
    return await prisma.technicians.create({
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

// Service to verify technician is logged in
export const isTechnicianSignedIn = async (tech_id: string) => {
    return await prisma.technicians.findUnique({
        where: {
            tech_id,
        },
        select: {
            tech_id: true,
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
};

// Service to approve a technician
export const approveTechnicianService = async (dealer_id: string, tech_id: string) => {
    const existingTechnician = await prisma.technicians.findUnique({
        where: { tech_id, dealerid: dealer_id },
    });

    if (!existingTechnician) throw new Error('Technician do not exist');

    return await prisma.technicians.update({
        where: {
            tech_id,
        },
        data: {
            isApproved: true,
        },
    });
};

// Service to fetch all approved technicians
export const getAllApprovedTechniciansService = async (dealer_id: string) => {
    const existingDealer = await prisma.dealers.findUnique({
        where: {
            dealer_id,
        },
    });
    if (!existingDealer) throw new Error('Dealer with this ID is not found');

    return await prisma.technicians.findMany({
        where: {
            isApproved: true,
        },
    });
};

// Service to fetch all not-approved technicians
export const getAllDisapprovedTechniciansService = async (dealer_id: string) => {
    const existingDealer = await prisma.dealers.findUnique({
        where: {
            dealer_id,
        },
    });
    if (!existingDealer) throw new Error('Dealer with this ID is not found');

    return await prisma.technicians.findMany({
        where: {
            isApproved: false,
        },
    });
};

// Service to disapprove a technician
export const disapproveTechnicianService = async (dealer_id: string, tech_id: string) => {
    const existingTechnician = await prisma.technicians.findUnique({
        where: { tech_id, dealerid: dealer_id },
    });

    if (!existingTechnician) throw new Error('Technician do not exist');

    return await prisma.technicians.update({
        where: {
            tech_id,
        },
        data: {
            isApproved: false,
        },
    });
};

// Service to fetch all technicians for a dealer
export const getAllTechniciansForDealer = async (dealer_id: string) => {
    return await prisma.technicians.findMany({
        where: {
            dealerid: dealer_id,
        },
    });
};
