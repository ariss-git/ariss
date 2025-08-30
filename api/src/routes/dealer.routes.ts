// src/routes/dealer.routes.ts

import { authMiddleware } from '../middleware/auth.middleware.js';
import * as dealerControllers from '../controllers/dealer.controller.js';
import { Router } from 'express';

const dealerRoutes = Router();

/**
 * ============================
 *       DEALER ROUTES
 * ============================
 */

/**
 * @route   POST /register
 * @desc    Register a new dealer account
 * @access  Public
 */
dealerRoutes.post('/register', dealerControllers.registerDealerController);

/**
 * @route   GET /profile
 * @desc    Check if a dealer is signed in and fetch profile details
 * @access  Private (Protected by authMiddleware)
 */
dealerRoutes.get('/profile', authMiddleware, dealerControllers.isDealerSignedInController);

export default dealerRoutes;
