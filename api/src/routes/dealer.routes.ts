// src/routes/dealer.routes.ts
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isDealerSignedInController, registerDealerController } from '../controllers/dealer.controller.js';
import { Router } from 'express';

const dealerRoutes = Router();

// Dealer Authentication
dealerRoutes.post('/register', registerDealerController);
dealerRoutes.get('/profile', authMiddleware, isDealerSignedInController);

export default dealerRoutes;
