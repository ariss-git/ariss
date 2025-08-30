// src/routes/customer.routes.ts

import * as customerControllers from '../controllers/customer.controller.js';
import { Router } from 'express';

const customerRoutes = Router();

/**
 * =====================
 *        DEALER
 * =====================
 */

// Get all dealers who are approved
customerRoutes.get('/dealers/approved', customerControllers.getAllApprovedCustomerController);

// Get all dealers who are not yet approved
customerRoutes.get('/dealers/not-approved', customerControllers.getAllNotApprovedCustomerController);

// Approve a dealer (promotes dealer to active user)
customerRoutes.put('/dealers/approved/:dealer_id', customerControllers.approveDealerController);

// Disapprove a dealer (revokes access/login ability)
customerRoutes.put('/dealers/not-approved/:dealer_id', customerControllers.disapproveDealerController);

// Update dealer profile or information
customerRoutes.put('/dealers/edit/:dealer_id', customerControllers.updateDealerController);

// Delete a dealer account permanently
customerRoutes.delete('/dealers/:dealer_id', customerControllers.deleteDealerController);

// Fetch single dealer
customerRoutes.get('/dealers/view-edit/:dealer_id', customerControllers.getSingleDealerController);

/**
 * =====================
 *     TECHNICIANS
 * =====================
 */

// Get list of all technicians
customerRoutes.get('/technicians', customerControllers.getAllTechniciansController);

// Update a technician's profile or role
customerRoutes.put('/technicians/:tech_id', customerControllers.updateTechnicianController);

// Delete a technician from the system
customerRoutes.delete('/technicians/:tech_id', customerControllers.deleteTechnicianController);

/**
 * =====================
 *     BACK OFFICE
 * =====================
 */

// Get all back office users
customerRoutes.get('/back-office', customerControllers.getAllBackOfficeController);

// Update back office user information
customerRoutes.put('/back-office/:backoffice_id', customerControllers.updateBackOfficeController);

// Delete a back office user
customerRoutes.delete('/back-office/:backoffice_id', customerControllers.deleteBackOfficeController);

/**
 * =====================
 *     DISTRIBUTORS
 * =====================
 */

// Get all dealers who are marked as distributors
customerRoutes.get('/distributor', customerControllers.getAllDistributorCustomerController);

// Assign a dealer to distributor role
customerRoutes.put('/distributor/:dealer_id', customerControllers.updateToDistributorController);

// Assign a distributor to dealer role
customerRoutes.put('/distributor-dealer/:dealer_id', customerControllers.updateDistributorToDealerController);

/**
 * =====================
 *     CUSTOMERS
 * =====================
 */

customerRoutes.get(`/all`, customerControllers.fetchAllCustomersController);

export default customerRoutes;
