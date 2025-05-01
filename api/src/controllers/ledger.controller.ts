// // src/controllers/ledger.controller.ts

// import { Request, Response } from 'express';
// import {
//     createLedgerEntryService,
//     updateLedgerPaymentService,
//     getDealerLedgerService,
// } from '../services/ledger.service.js';

// /**
//  * Creates a ledger entry for a credit-based order.
//  *
//  * @param {Request} req - The HTTP request containing ledger entry details.
//  * @param {Response} res - The HTTP response object.
//  */
// export const createLedgerEntryController = async (req: Request, res: Response) => {
//     try {
//         const { dealer_id, order_id, total_due } = req.body;
//         if (!dealer_id || !order_id || !total_due) {
//             return res.status(400).json({ success: false, message: 'Missing required fields' });
//         }

//         const ledger = await createLedgerEntryService({ dealer_id, order_id, total_due });
//         return res.status(201).json({ success: true, ledger });
//     } catch (error: any) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// /**
//  * Updates the ledger when a dealer makes a payment.
//  *
//  * @param {Request} req - The HTTP request containing dealer ID and payment amount.
//  * @param {Response} res - The HTTP response object.
//  */
// export const updateLedgerPaymentController = async (req: Request, res: Response) => {
//     try {
//         const { dealer_id, amountPaid } = req.body;

//         if (!dealer_id || !amountPaid) {
//             return res.status(400).json({ success: false, message: 'Missing required fields' });
//         }

//         const result = await updateLedgerPaymentService(dealer_id, amountPaid);
//         return res.status(200).json(result);
//     } catch (error: any) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// /**
//  * Retrieves ledger details for a specific dealer.
//  *
//  * @param {Request} req - The HTTP request containing the dealer ID.
//  * @param {Response} res - The HTTP response object.
//  */
// export const getDealerLedgerController = async (req: Request, res: Response) => {
//     try {
//         const { dealer_id } = req.params;
//         const result = await getDealerLedgerService(dealer_id);
//         return res.status(200).json(result);
//     } catch (error: any) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };
