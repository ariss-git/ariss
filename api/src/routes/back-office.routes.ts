// src/routes/back-office.routes.ts

import { authMiddleware } from '../middleware/auth.middleware.js';
import * as backOfficeControllers from '../controllers/back-office.controller.js';
import { Router } from 'express';

const backOfficeRoutes = Router();

/**
 * @route POST /register
 * @desc Register a new back-office user
 */
backOfficeRoutes.post('/register', backOfficeControllers.registerBackOfficeController);

/**
 * @route GET /check
 * @middleware authMiddleware
 * @desc Check if a back-office user is currently signed in
 */
backOfficeRoutes.get('/check', authMiddleware, backOfficeControllers.isBackOfficeSignedInController);

/**
 * @route PUT /approve/:dealer_id/:backoffice_id
 * @desc Approve a back-office user for a specific dealer
 */
backOfficeRoutes.put('/approve/:dealer_id/:backoffice_id', backOfficeControllers.approveBackOfficeController);

/**
 * @route GET /approved/:dealer_id
 * @desc Retrieve all approved back-office users for a specific dealer
 */
backOfficeRoutes.get('/approved/:dealer_id', backOfficeControllers.getAllApprovedBackOfficesController);

/**
 * @route GET /disapproved/:dealer_id
 * @desc Retrieve all disapproved back-office users for a specific dealer
 */
backOfficeRoutes.get('/disapproved/:dealer_id', backOfficeControllers.getAllDisapprovedBackOfficesController);

/**
 * @route PUT /disapprove/:dealer_id/:backoffice_id
 * @desc Disapprove a back-office user for a specific dealer
 */
backOfficeRoutes.put(
    '/disapprove/:dealer_id/:backoffice_id',
    backOfficeControllers.disapproveBackOfficeController
);

/**
 * @route GET /approvals/:dealer_id
 * @desc Retrieve all back-office users (both approved and pending) for a specific dealer
 */
backOfficeRoutes.get('/approvals/:dealer_id', backOfficeControllers.getAllBackofficesForDealerController);

export default backOfficeRoutes;
