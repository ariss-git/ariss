// src/routes/customer.routes.ts
import * as customerControllers from '../controllers/customer.controller.js';
import { Router } from 'express';
const customerRoutes = Router();
/**
 * =====================
 *        DEALERS
 * =====================
 */
/**
 * @route GET /dealers/approved
 * @desc Get all approved dealers
 */
customerRoutes.get('/dealers/approved', customerControllers.getAllApprovedCustomerController);
/**
 * @route GET /dealers/not-approved
 * @desc Get all dealers who are not approved
 */
customerRoutes.get('/dealers/not-approved', customerControllers.getAllNotApprovedCustomerController);
/**
 * @route PUT /dealers/approved/:dealer_id
 * @desc Approve a dealer (promote to active user)
 */
customerRoutes.put('/dealers/approved/:dealer_id', customerControllers.approveDealerController);
/**
 * @route PUT /dealers/not-approved/:dealer_id
 * @desc Disapprove a dealer (revoke access)
 */
customerRoutes.put('/dealers/not-approved/:dealer_id', customerControllers.disapproveDealerController);
/**
 * @route PUT /dealers/edit/:dealer_id
 * @desc Update dealer profile information
 */
customerRoutes.put('/dealers/edit/:dealer_id', customerControllers.updateDealerController);
/**
 * @route DELETE /dealers/:dealer_id
 * @desc Permanently delete a dealer
 */
customerRoutes.delete('/dealers/:dealer_id', customerControllers.deleteDealerController);
/**
 * @route GET /dealers/view-edit/:dealer_id
 * @desc Fetch a single dealer by ID
 */
customerRoutes.get('/dealers/view-edit/:dealer_id', customerControllers.getSingleDealerController);
/**
 * =====================
 *     TECHNICIANS
 * =====================
 */
/**
 * @route GET /technicians
 * @desc Get all technicians
 */
customerRoutes.get('/technicians', customerControllers.getAllTechniciansController);
/**
 * @route PUT /technicians/:tech_id
 * @desc Update a technician's profile or role
 */
customerRoutes.put('/technicians/:tech_id', customerControllers.updateTechnicianController);
/**
 * @route DELETE /technicians/:tech_id
 * @desc Delete a technician
 */
customerRoutes.delete('/technicians/:tech_id', customerControllers.deleteTechnicianController);
/**
 * =====================
 *     BACK OFFICE
 * =====================
 */
/**
 * @route GET /back-office
 * @desc Get all back-office users
 */
customerRoutes.get('/back-office', customerControllers.getAllBackOfficeController);
/**
 * @route PUT /back-office/:backoffice_id
 * @desc Update a back-office user's information
 */
customerRoutes.put('/back-office/:backoffice_id', customerControllers.updateBackOfficeController);
/**
 * @route DELETE /back-office/:backoffice_id
 * @desc Delete a back-office user
 */
customerRoutes.delete('/back-office/:backoffice_id', customerControllers.deleteBackOfficeController);
/**
 * =====================
 *     DISTRIBUTORS
 * =====================
 */
/**
 * @route GET /distributor
 * @desc Get all dealers marked as distributors
 */
customerRoutes.get('/distributor', customerControllers.getAllDistributorCustomerController);
/**
 * @route PUT /distributor/:dealer_id
 * @desc Assign distributor role to a dealer
 */
customerRoutes.put('/distributor/:dealer_id', customerControllers.updateToDistributorController);
/**
 * @route PUT /distributor-dealer/:dealer_id
 * @desc Reassign distributor back to dealer role
 */
customerRoutes.put('/distributor-dealer/:dealer_id', customerControllers.updateDistributorToDealerController);
/**
 * =====================
 *     CUSTOMERS
 * =====================
 */
/**
 * @route GET /all
 * @desc Fetch all customers
 */
customerRoutes.get('/all', customerControllers.fetchAllCustomersController);
export default customerRoutes;
