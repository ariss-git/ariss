import { prisma } from '../db/prismaSingleton.js';

/**
 * Creates a new ledger entry with credit payment details.
 */
export const createLedgerService = async (
    product_id: string,
    total: number,
    balance_due: number,
    quantity: number,
    user_id: string,
    username: string,
    usertype: string,
    business_name: string,
    shipping_address: string
) => {
    return await prisma.ledger.create({
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
};

/**
 * Retrieves all ledger entries, including product details.
 */
export const fetchAllLedgerService = async () => {
    return await prisma.ledger.findMany({
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
};

/**
 * Retrieves a single ledger entry by its ID, including product details.
 */
export const fetchSingleLedgerService = async (ledger_id: string) => {
    const existingLedger = await prisma.ledger.findUnique({
        where: {
            ledger_id,
        },
    });

    if (!existingLedger) {
        throw new Error('Ledger does not exists');
    }

    return await prisma.ledger.findUnique({
        where: {
            ledger_id,
        },
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
};

/**
 * Retrieves the first ledger entry for a specific business name.
 */
export const fetchUsersLedgerService = async (user_id: string) => {
    const existingLedger = await prisma.ledger.findFirst({
        where: {
            user_id,
        },
    });

    if (!existingLedger) {
        throw new Error('Ledger does not exists');
    }

    return await prisma.ledger.findFirst({
        where: {
            user_id,
        },
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
};

/**
 * Updates the due date for a specific ledger entry.
 */
export const setDueDateService = async (ledger_id: string, due_date: string) => {
    const existingLedger = await prisma.ledger.findUnique({
        where: {
            ledger_id,
        },
    });

    if (!existingLedger) {
        throw new Error('Ledger does not exists');
    }

    return await prisma.ledger.update({
        where: {
            ledger_id,
        },
        data: {
            due_date,
        },
    });
};

/**
 * Updates the amount paid and recalculates balance due for a ledger entry.
 */
export const updateAmountsService = async (ledger_id: string, amount_paid: number) => {
    const totalAmount = await prisma.ledger.findUnique({
        where: {
            ledger_id,
        },
        select: {
            total: true,
        },
    });

    if (!totalAmount) {
        throw new Error('Ledger does not exists');
    }

    const balanceDue = totalAmount.total - amount_paid;

    return await prisma.ledger.update({
        where: {
            ledger_id,
        },
        data: {
            amount_paid,
            balance_due: balanceDue,
        },
    });
};

/**
 * Cancels (deletes) a specific ledger entry.
 */
export const cancelLedgerOrderService = async (ledger_id: string) => {
    const existingLedger = await prisma.ledger.findUnique({
        where: {
            ledger_id,
        },
    });

    if (!existingLedger) {
        throw new Error('Ledger does not exists');
    }

    return await prisma.ledger.delete({
        where: {
            ledger_id,
        },
    });
};
