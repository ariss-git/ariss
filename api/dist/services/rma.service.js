// src/services/rma.service.ts
import { rmaAccepted } from '../lib/rmaNotifications/rmaAccepted.js';
import { prisma } from '../db/prismaSingleton.js';
import { RMAStatus } from '@prisma/client';
import { rmaReceived } from '../lib/rmaNotifications/rmaReceived.js';
import { rmaRejected } from '../lib/rmaNotifications/rmaRejected.js';
import { rmaResolved } from '../lib/rmaNotifications/rmaResolved.js';
export class RMAService {
    prismaClient;
    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient; // Assign default Prisma client or a custom instance
    }
    /**
     * Creates a new RMA request form entry.
     * Validates for duplicate submissions and sends initial notifications.
     * @param formData - Data submitted via RMA form
     * @returns Created RMA record
     */
    async rmaRequestFormService(formData) {
        // Check for existing RMA request to prevent duplicates
        const existingRMA = await this.prismaClient.rMA.findFirst({
            where: { phone: formData.phone, email: formData.email },
        });
        if (existingRMA) {
            throw new Error('RMA already in process'); // Prevent duplicate RMA submissions
        }
        // Create a new RMA record in the database
        const rmaForm = await this.prismaClient.rMA.create({
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
        // Trigger WhatsApp notification for received RMA
        await rmaReceived(formData.phone, formData.email, formData.product_name);
        return rmaForm;
    }
    /**
     * Marks an RMA request as "ACCEPTED" and triggers notifications.
     * @param rma_id - Unique identifier for the RMA request
     * @returns Updated RMA record
     */
    async rmaRequestAcceptedService(rma_id) {
        const existingRMA = await this.prismaClient.rMA.findUnique({
            where: { rma_id },
            select: { phone: true, email: true, product_name: true, status: true },
        });
        if (!existingRMA)
            throw new Error('RMA with this id does not exist');
        const { phone, email, product_name } = existingRMA;
        // Notify user via WhatsApp and Email that RMA is accepted
        await rmaAccepted(phone, email, product_name);
        return await this.prismaClient.rMA.update({
            where: { rma_id },
            data: { status: RMAStatus.ACCEPTED },
        });
    }
    /**
     * Marks an RMA request as "REJECTED" and triggers notifications.
     * @param rma_id - Unique identifier for the RMA request
     * @returns Updated RMA record
     */
    async rmaRequestRejectedService(rma_id) {
        const existingRMA = await this.prismaClient.rMA.findUnique({
            where: { rma_id },
            select: { phone: true, email: true, product_name: true, status: true },
        });
        if (!existingRMA)
            throw new Error('RMA with this id does not exist');
        const { phone, email, product_name } = existingRMA;
        // Notify user via WhatsApp and Email that RMA is rejected
        await rmaRejected(phone, email, product_name);
        return await this.prismaClient.rMA.update({
            where: { rma_id },
            data: { status: RMAStatus.REJECTED },
        });
    }
    /**
     * Marks an RMA request as "RESOLVED" after issue resolution and triggers notifications.
     * @param rma_id - Unique identifier for the RMA request
     * @returns Updated RMA record
     */
    async rmaRequestResolvedService(rma_id) {
        const existingRMA = await this.prismaClient.rMA.findUnique({
            where: { rma_id },
            select: { phone: true, email: true, product_name: true },
        });
        if (!existingRMA)
            throw new Error('RMA with this id do not exists');
        // Notify user that RMA has been resolved
        await rmaResolved(existingRMA.phone, existingRMA.email, existingRMA.product_name);
        return await this.prismaClient.rMA.update({
            where: { rma_id },
            data: { status: RMAStatus.RESOLVED },
        });
    }
    /**
     * Retrieves all RMA requests from the database.
     * @returns List of all RMA records
     */
    async getAllRMAService() {
        return await this.prismaClient.rMA.findMany();
    }
    /**
     * Retrieves a single RMA request by its ID.
     * @param rma_id - Unique identifier for the RMA request
     * @returns RMA record
     */
    async getSingleRMAService(rma_id) {
        const existingRMA = await this.prismaClient.rMA.findUnique({ where: { rma_id } });
        if (!existingRMA)
            throw new Error('RMA with this id do not exists');
        return existingRMA;
    }
    /**
     * Deletes a specific RMA request by ID.
     * @param rma_id - Unique identifier for the RMA request
     * @returns Deleted RMA record
     */
    async deleteRMARequestService(rma_id) {
        const existingRMA = await this.prismaClient.rMA.findUnique({ where: { rma_id } });
        if (!existingRMA)
            throw new Error('RMA with this id do not exists');
        return await this.prismaClient.rMA.delete({ where: { rma_id } });
    }
}
