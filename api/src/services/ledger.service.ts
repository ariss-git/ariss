// src/services/ledger.service.ts

import { prisma } from '../db/prismaSingleton.js';

/**
 *
 * This service class handles all business logic related to ledger operations,
 * including creating ledger entries, fetching ledger records, updating payment
 * details, setting due dates, and cancelling orders. All database interactions
 * are performed through Prisma.
 */
export class LedgerService {
    private prismaClient;

    constructor(prismaClient = prisma) {
        this.prismaClient = prismaClient;
    }

    /**
     * @desc      Creates a new ledger entry with credit payment details.
     * @params    product_id, total, balance_due, quantity, user_id, username, usertype, business_name, shipping_address
     * @returns   Newly created ledger record
     */
    async createLedgerService(
        product_id: string,
        total: number,
        balance_due: number,
        quantity: number,
        user_id: string,
        username: string,
        usertype: string,
        business_name: string,
        shipping_address: string
    ) {
        return await this.prismaClient.ledger.create({
            data: {
                product_id,
                total,
                balance_due,
                quantity,
                user_id,
                username,
                usertype,
                business_name,
                shipping_address,
            },
        });
    }

    /**
     * @desc      Retrieves all ledger entries with product details.
     * @returns   Array of ledger records with selected product info
     */
    async fetchAllLedgerService() {
        return await this.prismaClient.ledger.findMany({
            select: {
                ledger_id: true,
                total: true,
                balance_due: true,
                amount_paid: true,
                quantity: true,
                product_id: true,
                user_id: true,
                username: true,
                usertype: true,
                business_name: true,
                shipping_address: true,
                due_date: true,
                createdAt: true,
                payment_mode: true,
                product: {
                    select: {
                        product_title: true,
                        product_image: true,
                    },
                },
            },
        });
    }

    /**
     * @desc      Retrieves a single ledger entry by its ID, including product details.
     * @param     ledger_id - Ledger ID to fetch
     * @returns   Ledger record with product info
     */
    async fetchSingleLedgerService(ledger_id: string) {
        const existingLedger = await this.prismaClient.ledger.findUnique({
            where: { ledger_id },
        });

        if (!existingLedger) {
            throw new Error('Ledger does not exists');
        }

        return await this.prismaClient.ledger.findUnique({
            where: { ledger_id },
            select: {
                ledger_id: true,
                total: true,
                balance_due: true,
                amount_paid: true,
                quantity: true,
                product_id: true,
                user_id: true,
                username: true,
                usertype: true,
                business_name: true,
                shipping_address: true,
                due_date: true,
                createdAt: true,
                payment_mode: true,
                product: {
                    select: {
                        product_title: true,
                        product_image: true,
                    },
                },
            },
        });
    }

    /**
     * @desc      Retrieves all ledger entries for a specific user.
     * @param     user_id - User ID to fetch ledgers
     * @returns   Array of ledger records for the user
     */
    async fetchUsersLedgerService(user_id: string) {
        const existingLedger = await this.prismaClient.ledger.findFirst({
            where: { user_id },
        });

        if (!existingLedger) {
            throw new Error('Ledger does not exists');
        }

        return await this.prismaClient.ledger.findMany({
            where: { user_id },
            select: {
                ledger_id: true,
                total: true,
                balance_due: true,
                amount_paid: true,
                quantity: true,
                product_id: true,
                due_date: true,
                createdAt: true,
                payment_mode: true,
                product: {
                    select: {
                        product_title: true,
                        product_image: true,
                    },
                },
            },
        });
    }

    /**
     * @desc      Updates the due date for a specific ledger entry.
     * @param     ledger_id - Ledger ID
     * @param     due_date - New due date
     * @returns   Updated ledger record
     */
    async setDueDateService(ledger_id: string, due_date: string) {
        const existingLedger = await this.prismaClient.ledger.findUnique({
            where: { ledger_id },
        });

        if (!existingLedger) {
            throw new Error('Ledger does not exists');
        }

        return await this.prismaClient.ledger.update({
            where: { ledger_id },
            data: { due_date },
        });
    }

    /**
     * @desc      Updates the amount paid and recalculates balance due.
     * @param     ledger_id - Ledger ID
     * @param     amount_paid - Amount paid to update
     * @returns   Updated ledger record
     */
    async updateAmountsService(ledger_id: string, amount_paid: number) {
        const totalAmount = await this.prismaClient.ledger.findUnique({
            where: { ledger_id },
            select: { total: true },
        });

        if (!totalAmount) {
            throw new Error('Ledger does not exists');
        }

        const balanceDue = totalAmount.total - amount_paid;

        return await this.prismaClient.ledger.update({
            where: { ledger_id },
            data: {
                amount_paid,
                balance_due: balanceDue,
            },
        });
    }

    /**
     * @desc      Cancels (deletes) a specific ledger entry.
     * @param     ledger_id - Ledger ID to cancel
     * @returns   Deleted ledger record
     */
    async cancelLedgerOrderService(ledger_id: string) {
        const existingLedger = await prisma.ledger.findUnique({
            where: { ledger_id },
        });

        if (!existingLedger) {
            throw new Error('Ledger does not exists');
        }

        return await prisma.ledger.delete({
            where: { ledger_id },
        });
    }
}
