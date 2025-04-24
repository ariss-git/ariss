// src/services/ledger.service.ts

import { prisma } from '../db/prismaSingleton.js';

interface LedgerEntryInput {
    dealer_id: string;
    order_id: string;
    total_due: number;
}

/**
 * Creates a ledger entry when a credit order is placed.
 *
 * @param {LedgerEntryInput} ledgerData - The credit order details including dealer ID, order ID, and due amount.
 * @returns {Promise<Object>} - The created ledger entry.
 */
export const createLedgerEntryService = async ({ dealer_id, order_id, total_due }: LedgerEntryInput) => {
    console.log('Creating Ledger Entry');

    return prisma.ledger.create({
        data: {
            dealer_id,
            order_id,
            total_due,
            amount_paid: 0,
            balance_due: total_due,
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Due in 30 days
        },
    });
};

/**
 * Updates a ledger entry when a dealer makes a payment.
 *
 * @param {string} dealer_id - The ID of the dealer making the payment.
 * @param {number} amountPaid - The amount being paid by the dealer.
 * @returns {Promise<Object>} - The updated ledger entry.
 */
export const updateLedgerPaymentService = async (dealer_id: string, amountPaid: number) => {
    console.log(`Updating Ledger for Dealer: ${dealer_id}`);

    // Fetch existing ledger entry
    const ledger = await prisma.ledger.findFirst({ where: { dealer_id } });

    if (!ledger) {
        throw new Error('Ledger entry not found');
    }

    const newAmountPaid = ledger.amount_paid + amountPaid;
    const newBalanceDue = ledger.total_due - newAmountPaid;

    return prisma.ledger.update({
        where: { ledger_id: ledger.ledger_id },
        data: {
            amount_paid: newAmountPaid,
            balance_due: newBalanceDue,
        },
    });
};

/**
 * Retrieves the ledger details for a specific dealer.
 *
 * @param {string} dealer_id - The ID of the dealer whose ledger details are requested.
 * @returns {Promise<Object[]>} - List of ledger entries associated with the dealer.
 */
export const getDealerLedgerService = async (dealer_id: string) => {
    console.log(`Fetching Ledger for Dealer: ${dealer_id}`);

    const ledger = await prisma.ledger.findMany({
        where: { dealer_id },
    });

    if (!ledger.length) {
        throw new Error('No ledger found for this dealer');
    }

    return ledger;
};
