// src/routes/customer.routes.ts

import {
    approveDealerController,
    deleteBackOfficeController,
    deleteDealerController,
    deleteTechnicianController,
    disapproveDealerController,
    fetchAllCustomersController,
    getAllApprovedCustomerController,
    getAllBackOfficeController,
    getAllDistributorCustomerController,
    getAllNotApprovedCustomerController,
    getAllTechniciansController,
    getSingleDealerController,
    updateBackOfficeController,
    updateDealerController,
    updateDistributorToDealerController,
    updateTechnicianController,
    updateToDistributorController,
} from '../controllers/customer.controller.js';
import { Router } from 'express';

const customerRoutes = Router();

/**
 * =====================
 *        DEALER
 * =====================
 */

// Get all dealers who are approved
customerRoutes.get('/dealers/approved', getAllApprovedCustomerController);

// Get all dealers who are not yet approved
customerRoutes.get('/dealers/not-approved', getAllNotApprovedCustomerController);

// Approve a dealer (promotes dealer to active user)
customerRoutes.put('/dealers/approved/:dealer_id', approveDealerController);

// Disapprove a dealer (revokes access/login ability)
customerRoutes.put('/dealers/not-approved/:dealer_id', disapproveDealerController);

// Update dealer profile or information
customerRoutes.put('/dealers/edit/:dealer_id', updateDealerController);

// Delete a dealer account permanently
customerRoutes.delete('/dealers/:dealer_id', deleteDealerController);

// Fetch single dealer
customerRoutes.get('/dealers/view-edit/:dealer_id', getSingleDealerController);

/**
 * =====================
 *     TECHNICIANS
 * =====================
 */

// Get list of all technicians
customerRoutes.get('/technicians', getAllTechniciansController);

// Update a technician's profile or role
customerRoutes.put('/technicians/:tech_id', updateTechnicianController);

// Delete a technician from the system
customerRoutes.delete('/technicians/:tech_id', deleteTechnicianController);

/**
 * =====================
 *     BACK OFFICE
 * =====================
 */

// Get all back office users
customerRoutes.get('/back-office', getAllBackOfficeController);

// Update back office user information
customerRoutes.put('/back-office/:backoffice_id', updateBackOfficeController);

// Delete a back office user
customerRoutes.delete('/back-office/:backoffice_id', deleteBackOfficeController);

/**
 * =====================
 *     DISTRIBUTORS
 * =====================
 */

// Get all dealers who are marked as distributors
customerRoutes.get('/distributor', getAllDistributorCustomerController);

// Assign a dealer to distributor role
customerRoutes.put('/distributor/:dealer_id', updateToDistributorController);

// Assign a distributor to dealer role
customerRoutes.put('/distributor-dealer/:dealer_id', updateDistributorToDealerController);

/**
 * =====================
 *     CUSTOMERS
 * =====================
 */

customerRoutes.get(`/all`, fetchAllCustomersController);

export default customerRoutes;
