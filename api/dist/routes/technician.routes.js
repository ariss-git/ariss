// src/routes/technician.routes.ts
import { authMiddleware } from '../middleware/auth.middleware.js';
import { approveTechnicianController, disapproveTechnicianController, getAllApprovedTechniciansController, getAllDisapprovedTechniciansController, getAllTechniciansForDealerController, isTechnicianSignedInController, registerTechinicianController, } from '../controllers/technician.controller.js';
import { Router } from 'express';
const technicianRoutes = Router();
technicianRoutes.post('/register', registerTechinicianController);
technicianRoutes.get('/check', authMiddleware, isTechnicianSignedInController);
technicianRoutes.put('/approve/:dealer_id/:tech_id', approveTechnicianController);
technicianRoutes.get('/approved/:dealer_id', getAllApprovedTechniciansController);
technicianRoutes.get('/disapproved/:dealer_id', getAllDisapprovedTechniciansController);
technicianRoutes.put('/disapprove/:dealer_id/:tech_id', disapproveTechnicianController);
technicianRoutes.get('/approvals/:dealer_id', getAllTechniciansForDealerController);
export default technicianRoutes;
