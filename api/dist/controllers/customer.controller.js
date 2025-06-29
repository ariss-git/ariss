// src/controllers/customer.controller.ts
import { approveDealerService, deleteBackOfficeService, deleteDealerService, deleteTechnicianService, disapproveDealerService, fetchAllCustomersService, getAllApprovedCustomerService, getAllBackOfficeService, getAllDistributorCustomerService, getAllNotApprovedCustomerService, getAllTechniciansService, getSingleDealerService, updateBackOfficeService, updateDealerService, updateDistributorToDealerService, updateTechnicianService, updateToDistributorService, } from '../services/customer.service.js';
/**
 * =========================
 *        DEALERS
 * =========================
 */
// Fetch all approved dealers
export const getAllApprovedCustomerController = async (req, res) => {
    try {
        const dealers = await getAllApprovedCustomerService();
        if (!dealers) {
            return res
                .status(400)
                .json({ success: false, error: 'Failed fetching all the approved dealers' });
        }
        return res.status(200).json({ success: true, total: dealers.length, data: dealers });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
// Fetch single dealer controller
export const getSingleDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            return res.status(400).json({ success: false, error: 'Dealer with this ID is invalid' });
        }
        const dealer = await getSingleDealerService(dealer_id);
        return res.status(200).json({ success: true, data: dealer });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
// Fetch all non-approved dealers
export const getAllNotApprovedCustomerController = async (_req, res) => {
    try {
        const dealers = await getAllNotApprovedCustomerService();
        if (!dealers) {
            return res
                .status(400)
                .json({ success: false, error: 'Failed fetching all the not approved dealers' });
        }
        return res.status(200).json({ success: true, total: dealers.length, data: dealers });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
// Approve a dealer account
export const approveDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            res.status(400).json({ message: 'Dealer ID is required' });
        }
        const approve = await approveDealerService(dealer_id);
        return res.status(200).json({ success: true, message: `${approve.business_name} is approved` });
    }
    catch (error) {
        res.status(400).json({ message: 'Something went wrong', error: error.message });
    }
};
// Disapprove a dealer account
export const disapproveDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            res.status(400).json({ message: 'Dealer ID is required' });
        }
        const approve = await disapproveDealerService(dealer_id);
        return res.status(200).json({ success: true, message: `${approve.business_name} is disapproved` });
    }
    catch (error) {
        res.status(400).json({ message: 'Something went wrong', error: error.message });
    }
};
// Update dealer details (profile, status)
export const updateDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        const { first_name, last_name, profile_pic, isApproved } = req.body;
        if (!dealer_id) {
            res.status(400).json({ message: 'Dealer ID is required' });
        }
        const dealer = await updateDealerService(dealer_id, first_name, last_name, profile_pic, isApproved);
        return res.json({ success: true, data: dealer });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to update dealer info', error: error.message });
    }
};
// Promote a dealer to distributor
export const updateToDistributorController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            res.status(400).json({ message: 'Dealer ID is required' });
        }
        const distributor = await updateToDistributorService(dealer_id);
        return res.json({
            success: true,
            message: `${distributor.business_name} updated to Distributor`,
            data: distributor,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to update dealer info', error: error.message });
    }
};
// Assign a distributor to dealer
export const updateDistributorToDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            res.status(400).json({ message: 'Dealer ID is required' });
        }
        const distributor = await updateDistributorToDealerService(dealer_id);
        return res.json({
            success: true,
            message: `${distributor.business_name} updated to Distributor`,
            data: distributor,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to update dealer info', error: error.message });
    }
};
// Permanently delete a dealer
export const deleteDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            return res.status(404).json({ success: false, error: 'Dealer ID is required' });
        }
        const dealer = await deleteDealerService(dealer_id);
        return res.status(200).json({
            success: true,
            message: `${dealer.first_name} ${dealer.last_name} deleted successfully`,
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
/**
 * =========================
 *       TECHNICIANS
 * =========================
 */
// Fetch all technicians
export const getAllTechniciansController = async (req, res) => {
    try {
        const technicians = await getAllTechniciansService();
        if (!technicians) {
            return res.status(400).json({ success: false, error: 'Failed fetching all the technicians' });
        }
        return res.status(200).json({ success: true, total: technicians.length, data: technicians });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
// Update technician details (profile, pass status)
export const updateTechnicianController = async (req, res) => {
    try {
        const { tech_id } = req.params;
        const { first_name, last_name, profile_pic, isPassed } = req.body;
        if (!tech_id) {
            res.status(400).json({ message: 'Technician ID is required' });
        }
        const technician = await updateTechnicianService(tech_id, first_name, last_name, profile_pic, isPassed);
        return res.json({ success: true, data: technician });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to update technician info', error: error.message });
    }
};
// Delete a technician account
export const deleteTechnicianController = async (req, res) => {
    try {
        const { tech_id } = req.params;
        if (!tech_id) {
            return res.status(404).json({ success: false, error: 'Technician ID is required' });
        }
        const technician = await deleteTechnicianService(tech_id);
        return res.status(200).json({
            success: true,
            message: `${technician.first_name} ${technician.last_name} deleted successfully`,
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
/**
 * =========================
 *       BACK OFFICE
 * =========================
 */
// Fetch all back office users
export const getAllBackOfficeController = async (req, res) => {
    try {
        const backOffice = await getAllBackOfficeService();
        if (!backOffice) {
            return res.status(400).json({ success: false, error: 'Failed fetching all the back office' });
        }
        return res.status(200).json({ success: true, total: backOffice.length, data: backOffice });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
// Update back office user profile
export const updateBackOfficeController = async (req, res) => {
    try {
        const { backoffice_id } = req.params;
        const { first_name, last_name, profile_pic } = req.body;
        if (!backoffice_id) {
            res.status(400).json({ message: 'Back Office ID is required' });
        }
        const backOffice = await updateBackOfficeService(backoffice_id, first_name, last_name, profile_pic);
        return res.json({ success: true, data: backOffice });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to update backOffice info', error: error.message });
    }
};
// Delete a back office user
export const deleteBackOfficeController = async (req, res) => {
    try {
        const { backoffice_id } = req.params;
        if (!backoffice_id) {
            return res.status(404).json({ success: false, error: 'Back Office ID is required' });
        }
        const backOffice = await deleteBackOfficeService(backoffice_id);
        return res.status(200).json({
            success: true,
            message: `${backOffice.first_name} ${backOffice.last_name} deleted successfully`,
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
/**
 * =========================
 *       DISTRIBUTORS
 * =========================
 */
// Fetch all dealers marked as distributors
export const getAllDistributorCustomerController = async (_req, res) => {
    try {
        const distributors = await getAllDistributorCustomerService();
        if (!distributors) {
            return res.status(400).json({ success: false, error: 'Failed fetching all the distributors' });
        }
        return res.status(200).json({ success: true, total: distributors.length, data: distributors });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
/**
 * =========================
 *       CUSTOMERS
 * =========================
 */
// Fetch all sorts of customers controller
export const fetchAllCustomersController = async (_req, res) => {
    try {
        const customers = await fetchAllCustomersService();
        if (!customers.dealers) {
            return res.status(404).json({ success: true, error: 'There was an error fetching dealers' });
        }
        if (!customers.techs) {
            return res.status(404).json({ success: true, error: 'There was an error fetching technicians' });
        }
        if (!customers.backoffices) {
            return res.status(404).json({ success: true, error: 'There was an error fetching back offices' });
        }
        return res.status(200).json({ success: true, data: customers });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
