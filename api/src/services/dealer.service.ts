// src/services/dealer.service.ts

import { prisma } from '../db/prismaSingleton.js';
import { Prisma, UserType } from '@prisma/client';
import { validateGST } from '../lib/validateGST.js';
import { verifyOTP } from './otp.service.js';
import { waitforApprovalNotification } from '../lib/waitForApprovalNotification.js';

export const registerDealerService = async (
    phone: string,
    email: string,
    first_name: string,
    last_name: string,
    gstin: string,
    usertype: string,
    shipping_address: { pncd: string; loc: string; dst: string; stcd: string; adr: string } | null,
    apiKey: string,
    otp: string
) => {
    try {
        console.log('Checking Existing Dealer...');
        const existingDealer = await prisma.dealers.findFirst({
            where: { OR: [{ phone }, { email }] },
        });

        if (existingDealer) {
            console.error('Dealer Already Exists');
            throw new Error('Dealer account already exists...');
        }

        console.log('OTP Verification for:', email);
        if (!(await verifyOTP(email, otp))) {
            console.error('Invalid OTP');
            throw new Error('Invalid or expired OTP');
        }

        console.log('Validating User Type...');
        const userTypeEnum = usertype as UserType;
        if (!Object.values(UserType).includes(userTypeEnum)) {
            console.error(`Invalid User Type: ${usertype}`);
            throw new Error(`Invalid user type: ${usertype}`);
        }

        console.log('Fetching GSTIN Details...');
        const gstDetails = await validateGST(gstin, apiKey);
        if (!gstDetails) {
            console.error('GSTIN Validation Failed');
            throw new Error('Failed to fetch GST details');
        }

        console.log('GSTIN Valid:', gstDetails.tradeNam);
        const business_name = gstDetails.tradeNam || 'N/A';

        const billing_address = {
            pncd: gstDetails.pradr.addr?.pncd || '',
            st: gstDetails.pradr.addr?.st || '',
            dst: gstDetails.pradr.addr?.dst || '',
            loc: gstDetails.pradr.addr?.loc || '',
            stcd: gstDetails.pradr.addr?.stcd || '',
            adr: gstDetails.pradr.addr?.bnm || '',
        };

        console.log('Saving Dealer...');
        const dealer = await prisma.dealers.create({
            data: {
                phone,
                email,
                first_name,
                last_name,
                gstin,
                usertype: userTypeEnum,
                business_name,
                billing_address,
                shipping_address: shipping_address ? shipping_address : Prisma.JsonNull,
            },
        });

        console.log('Dealer Successfully Created:', dealer);

        console.log('Sending Approval Notification...');
        await waitforApprovalNotification(dealer.phone, dealer.first_name, dealer.last_name, dealer.email);

        return dealer;
    } catch (error) {
        console.error('Error in registerDealerService:', error);
        throw error; // Keep throwing the error so it can be handled by the controller
    }
};

// Service to verify dealer login
export const isDealerSignedIn = async (dealer_id: string) => {
    return await prisma.dealers.findUnique({
        where: { dealer_id },
        select: {
            dealer_id: true,
            email: true,
            phone: true,
            first_name: true,
            last_name: true,
            business_name: true,
            gstin: true,
            billing_address: true,
            shipping_address: true,
            createdAt: true,
            usertype: true,
        },
    });
};
