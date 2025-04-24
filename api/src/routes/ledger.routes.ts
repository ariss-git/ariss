// src/routes/ledger.routes.ts

import express from 'express';
import {
    createLedgerEntryController,
    updateLedgerPaymentController,
    getDealerLedgerController,
} from '../controllers/ledger.controller.js';

const ledgerRoutes = express.Router();

/**
 * @route POST /ledger
 * @description Creates a ledger entry for a credit-based order.
 * @access Public
 */
ledgerRoutes.post('/', createLedgerEntryController);

/**
 * @route PATCH /ledger/payment
 * @description Updates a ledger entry when a dealer makes a payment.
 * @access Public
 */
ledgerRoutes.patch('/payment', updateLedgerPaymentController);

/**
 * @route GET /ledger/:dealer_id
 * @description Retrieves ledger details for a specific dealer.
 * @access Public
 */
ledgerRoutes.get('/:dealer_id', getDealerLedgerController);

export default ledgerRoutes;
