// src/controllers/ledger.controller.ts

import { LedgerService } from '../services/ledger.service.js';
import { Request, Response } from 'express';

const ledgerServices = new LedgerService();

/**
 * @desc      Controller to create a new ledger order
 * @route     POST /ledger
 * @access    Public (or auth-protected if middleware is applied)
 */
export const createLedgerController = async (req: Request, res: Response) => {
    const {
        product_id,
        total,
        balance_due,
        quantity,
        user_id,
        username,
        usertype,
        business_name,
        shipping_address,
    } = req.body;

    if (
        !product_id ||
        total === undefined ||
        balance_due === undefined ||
        quantity === undefined ||
        !user_id ||
        !username ||
        !usertype ||
        !business_name ||
        !shipping_address
    ) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const ledger = await ledgerServices.createLedgerService(
            product_id,
            total,
            balance_due,
            quantity,
            user_id,
            username,
            usertype,
            business_name,
            shipping_address
        );
        res.status(201).json({ success: true, data: ledger });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Controller to fetch all ledger orders
 * @route     GET /ledger
 * @access    Public
 */
export const fetchAllLedgerController = async (req: Request, res: Response) => {
    try {
        const ledger = await ledgerServices.fetchAllLedgerService();
        return res.status(200).json({ success: true, data: ledger });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Controller to fetch a single ledger order by ID
 * @route     GET /ledger/:ledger_id
 * @access    Public
 */
export const fetchSingleLedgerController = async (req: Request, res: Response) => {
    const { ledger_id } = req.params;

    if (!ledger_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }

    try {
        const ledger = await ledgerServices.fetchSingleLedgerService(ledger_id);
        return res.status(200).json({ success: true, data: ledger });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Controller to fetch all ledger orders for a specific user
 * @route     GET /ledger/user/:user_id
 * @access    Public
 */
export const fetchUserLedgerController = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }

    try {
        const ledger = await ledgerServices.fetchUsersLedgerService(user_id);
        return res.status(200).json({ success: true, data: ledger });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Controller to set the due date for a ledger order
 * @route     PATCH /ledger/:ledger_id/due-date
 * @access    Public
 */
export const setDueDateController = async (req: Request, res: Response) => {
    const { ledger_id } = req.params;
    const { due_date } = req.body;

    if (!ledger_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }

    if (!due_date) {
        return res.status(404).json({ success: false, message: 'Due Date is not found or set' });
    }

    try {
        const ledger = await ledgerServices.setDueDateService(ledger_id, due_date);
        return res.status(200).json({ success: true, data: ledger });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Controller to update the amount paid on a ledger order
 * @route     PATCH /ledger/:ledger_id/amount
 * @access    Public
 */
export const updateAmountsController = async (req: Request, res: Response) => {
    const { ledger_id } = req.params;
    const { amount_paid } = req.body;

    if (!ledger_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }

    if (!amount_paid) {
        return res.status(404).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const ledger = await ledgerServices.updateAmountsService(ledger_id, amount_paid);
        return res.status(200).json({ success: true, data: ledger });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc      Controller to cancel a ledger order
 * @route     DELETE /ledger/:ledger_id
 * @access    Public
 */
export const cancelLedgerOrderController = async (req: Request, res: Response) => {
    const { ledger_id } = req.params;

    if (!ledger_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }

    try {
        const ledger = await ledgerServices.cancelLedgerOrderService(ledger_id);
        return res.status(200).json({ success: true, data: ledger, message: 'Order cancel' });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
