// src/routes/technician.routes.ts
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as techinicianControllers from '../controllers/technician.controller.js';
import { Router } from 'express';
const technicianRoutes = Router();
// Route: POST /register
// Method: POST
// Description: Register a new technician
technicianRoutes.post('/register', techinicianControllers.registerTechinicianController);
// Route: GET /check
// Method: GET
// Description: Check if the technician is signed in (protected by auth middleware)
technicianRoutes.get('/check', authMiddleware, techinicianControllers.isTechnicianSignedInController);
// Route: PUT /approve/:dealer_id/:tech_id
// Method: PUT
// Description: Approve a technician for a specific dealer
technicianRoutes.put('/approve/:dealer_id/:tech_id', techinicianControllers.approveTechnicianController);
// Route: GET /approved/:dealer_id
// Method: GET
// Description: Fetch all approved technicians for a specific dealer
technicianRoutes.get('/approved/:dealer_id', techinicianControllers.getAllApprovedTechniciansController);
// Route: GET /disapproved/:dealer_id
// Method: GET
// Description: Fetch all disapproved technicians for a specific dealer
technicianRoutes.get('/disapproved/:dealer_id', techinicianControllers.getAllDisapprovedTechniciansController);
// Route: PUT /disapprove/:dealer_id/:tech_id
// Method: PUT
// Description: Disapprove a technician for a specific dealer
technicianRoutes.put('/disapprove/:dealer_id/:tech_id', techinicianControllers.disapproveTechnicianController);
// Route: GET /approvals/:dealer_id
// Method: GET
// Description: Fetch all technicians pending approval for a dealer
technicianRoutes.get('/approvals/:dealer_id', techinicianControllers.getAllTechniciansForDealerController);
export default technicianRoutes;
