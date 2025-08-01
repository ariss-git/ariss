// src/controllers/ledger.controller.ts
import * as ledgerServices from '../services/ledger.service.js';
// Controller to create a ledger order
export const createLedgerController = async (req, res) => {
    const { product_id, total, balance_due, quantity, user_id, username, usertype, business_name, shipping_address, } = req.body;
    if (!product_id ||
        total === undefined ||
        balance_due === undefined ||
        quantity === undefined ||
        !user_id ||
        !username ||
        !usertype ||
        !business_name ||
        !shipping_address) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        const ledger = await ledgerServices.createLedgerService(product_id, total, balance_due, quantity, user_id, username, usertype, business_name, shipping_address);
        res.status(201).json({ success: true, data: ledger });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to fetch all ledger orders
export const fetchAllLedgerController = async (req, res) => {
    try {
        const ledger = await ledgerServices.fetchAllLedgerService();
        return res.status(200).json({ success: true, data: ledger });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to fetch single ledger orders
export const fetchSingleLedgerController = async (req, res) => {
    const { ledger_id } = req.params;
    if (!ledger_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }
    try {
        const ledger = await ledgerServices.fetchSingleLedgerService(ledger_id);
        return res.status(200).json({ success: true, data: ledger });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to fetch single ledger orders for a user
export const fetchUserLedgerController = async (req, res) => {
    const { user_id } = req.params;
    if (!user_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }
    try {
        const ledger = await ledgerServices.fetchUsersLedgerService(user_id);
        return res.status(200).json({ success: true, data: ledger });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to set due date of ledger orders
export const setDueDateController = async (req, res) => {
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
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to update amount
export const updateAmountsController = async (req, res) => {
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
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to cancel ledger order
export const cancelLedgerOrderController = async (req, res) => {
    const { ledger_id } = req.params;
    if (!ledger_id) {
        return res
            .status(404)
            .json({ success: false, message: 'Ledger ID not found in params or is invalid' });
    }
    try {
        const ledger = await ledgerServices.cancelLedgerOrderService(ledger_id);
        return res.status(200).json({ success: true, data: ledger, message: 'Order cancel' });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
