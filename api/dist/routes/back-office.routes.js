// src/routes/back-office.routes.ts
import { authMiddleware } from '../middleware/auth.middleware.js';
import { registerBackOfficeController, isBackOfficeSignedInController, approveBackOfficeController, getAllApprovedBackOfficesController, getAllDisapprovedBackOfficesController, disapproveBackOfficeController, getAllBackofficesForDealerController, } from '../controllers/back-office.controller.js';
import { Router } from 'express';
const backOfficeRoutes = Router();
backOfficeRoutes.post('/register', registerBackOfficeController);
backOfficeRoutes.get('/check', authMiddleware, isBackOfficeSignedInController);
backOfficeRoutes.put('/approve/:dealer_id/:backoffice_id', approveBackOfficeController);
backOfficeRoutes.get('/approved/:dealer_id', getAllApprovedBackOfficesController);
backOfficeRoutes.get('/disapproved/:dealer_id', getAllDisapprovedBackOfficesController);
backOfficeRoutes.put('/disapprove/:dealer_id/:backoffice_id', disapproveBackOfficeController);
backOfficeRoutes.get('/approvals/:dealer_id', getAllBackofficesForDealerController);
export default backOfficeRoutes;
