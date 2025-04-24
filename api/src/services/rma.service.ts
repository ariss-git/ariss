// src/services/rma.service.ts

import { rmaAccepted } from '../lib/rmaNotifications/rmaAccepted.js';
import { prisma } from '../db/prismaSingleton.js';
import { RMAStatus } from '@prisma/client';
import { rmaReceived } from '../lib/rmaNotifications/rmaReceived.js';
import { rmaRejected } from '../lib/rmaNotifications/rmaRejected.js';
import { rmaResolved } from '../lib/rmaNotifications/rmaResolved.js';

// Type definition for incoming RMA form data
interface RequestForm {
    first_name: string;
    last_name: string;
    business_name: string;
    gstin: string;
    phone: string;
    email: string;
    user_type: string;
    product_name: string;
    product_serial: string;
    product_issue: string;
    product_images: string[];
}

// Handles creation of a new RMA request
export const rmaRequestFormService = async (formData: RequestForm) => {
    // Check if an RMA request already exists for the same phone and email
    const existingRMA = await prisma.rMA.findFirst({
        where: {
            phone: formData.phone,
            email: formData.email,
        },
    });

    if (existingRMA) {
        // Prevent duplicate submissions
        throw new Error('RMA already in process');
        // TODO: Trigger WhatsApp and email notifications
    }

    // Create a new RMA entry in the database
    const rmaForm = await prisma.rMA.create({
        data: {
            email: formData.email,
            phone: formData.phone,
            first_name: formData.first_name,
            last_name: formData.last_name,
            business_name: formData.business_name,
            gstin: formData.gstin,
            product_issue: formData.product_issue,
            product_name: formData.product_name,
            product_serial: formData.product_serial,
            user_type: formData.user_type,
            product_images: formData.product_images,
        },
    });

    // Whatsapp Notification
    await rmaReceived(formData.phone, formData.email, formData.product_name);

    return rmaForm;
};

// Updates RMA status to "ACCEPTED" after admin approval
export const rmaRequestAcceptedService = async (rma_id: string) => {
    const existingRMA = await prisma.rMA.findUnique({
        where: { rma_id },
        select: {
            phone: true,
            email: true,
            product_name: true,
            status: true,
        },
    });

    if (!existingRMA) {
        throw new Error('RMA with this id does not exist');
    }

    const { phone, email, product_name } = existingRMA;

    // WhatsApp + Email notification
    await rmaAccepted(phone, email, product_name);

    return await prisma.rMA.update({
        where: { rma_id },
        data: {
            status: RMAStatus.ACCEPTED,
        },
    });
};

// Updates RMA status to "REJECTED" if request is denied
export const rmaRequestRejectedService = async (rma_id: string) => {
    const existingRMA = await prisma.rMA.findUnique({
        where: { rma_id },
        select: {
            phone: true,
            email: true,
            product_name: true,
            status: true,
        },
    });

    if (!existingRMA) {
        throw new Error('RMA with this id does not exist');
    }

    const { phone, email, product_name } = existingRMA;

    // WhatsApp + Email notification
    await rmaRejected(phone, email, product_name);

    return await prisma.rMA.update({
        where: { rma_id },
        data: {
            status: RMAStatus.REJECTED,
        },
    });
};

// Updates RMA status to "RESOLVED" after issue is fixed
export const rmaRequestResolvedService = async (rma_id: string) => {
    const existingRMA = await prisma.rMA.findUnique({
        where: {
            rma_id,
        },
        select: {
            phone: true,
            email: true,
            product_name: true,
        },
    });

    if (!existingRMA) {
        throw new Error('RMA with this id do not exists');
    }

    // Whatsapp notification
    await rmaResolved(existingRMA.phone, existingRMA.email, existingRMA.product_name);

    return await prisma.rMA.update({
        where: {
            rma_id,
        },
        data: {
            status: RMAStatus.RESOLVED,
        },
    });
};

// Fetches all RMA requests from the database
export const getAllRMAService = async () => {
    return await prisma.rMA.findMany();
};

// Retrieves a specific RMA request by its ID
export const getSingleRMAService = async (rma_id: string) => {
    const existingRMA = await prisma.rMA.findUnique({
        where: {
            rma_id,
        },
    });

    if (!existingRMA) {
        throw new Error('RMA with this id do not exists');
    }

    return existingRMA;
};

// Deletes a specific rma request
export const deleteRMARequestService = async (rma_id: string) => {
    const existingRMA = await prisma.rMA.findUnique({
        where: {
            rma_id,
        },
    });

    if (!existingRMA) {
        throw new Error('RMA with this id do not exists');
    }

    return await prisma.rMA.delete({
        where: {
            rma_id,
        },
    });
};
