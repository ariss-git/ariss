import * as ledgerController from '../controllers/ledger.controller.js';
import express from 'express';

const ledgerRoutes = express.Router();

// Route to create a new ledger order
// Endpoint: POST /ledger/create
ledgerRoutes.post('/create', ledgerController.createLedgerController);

// Route to fetch all ledger orders
// Endpoint: GET /ledger/
ledgerRoutes.get('/', ledgerController.fetchAllLedgerController);

// Route to fetch a single ledger order by ledger ID
// Endpoint: GET /ledger/:ledger_id
ledgerRoutes.get('/:ledger_id', ledgerController.fetchSingleLedgerController);

// Route to fetch a user's ledger order(s) by business name
// Endpoint: GET /ledger/user/:business_name
ledgerRoutes.get('/user/:business_name', ledgerController.fetchUserLedgerController);

// Route to update the due date of a ledger order
// Endpoint: PUT /ledger/date/:ledger_id
ledgerRoutes.put('/date/:ledger_id', ledgerController.setDueDateController);

// Route to update the amount paid and balance due
// Endpoint: PUT /ledger/amount/:ledger_id
ledgerRoutes.put('/amount/:ledger_id', ledgerController.updateAmountsController);

// Route to cancel (delete) a ledger order by ID
// Endpoint: DELETE /ledger/:ledger_id
ledgerRoutes.delete('/:ledger_id', ledgerController.cancelLedgerOrderController);

export default ledgerRoutes;
