// src/routes/back-office.routes.ts

import { authMiddleware } from '../middleware/auth.middleware.js';
import * as backOfficeControllers from '../controllers/back-office.controller.js';
import { Router } from 'express';

const backOfficeRoutes = Router();

backOfficeRoutes.post('/register', backOfficeControllers.registerBackOfficeController);
backOfficeRoutes.get('/check', authMiddleware, backOfficeControllers.isBackOfficeSignedInController);
backOfficeRoutes.put('/approve/:dealer_id/:backoffice_id', backOfficeControllers.approveBackOfficeController);
backOfficeRoutes.get('/approved/:dealer_id', backOfficeControllers.getAllApprovedBackOfficesController);
backOfficeRoutes.get('/disapproved/:dealer_id', backOfficeControllers.getAllDisapprovedBackOfficesController);
backOfficeRoutes.put(
    '/disapprove/:dealer_id/:backoffice_id',
    backOfficeControllers.disapproveBackOfficeController
);
backOfficeRoutes.get('/approvals/:dealer_id', backOfficeControllers.getAllBackofficesForDealerController);

export default backOfficeRoutes;
