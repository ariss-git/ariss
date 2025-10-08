import axios from 'axios';
import { apiURL } from './apiURL';

type Dealer = {
    dealer_id: string;
    phone: string;
    email: string;
    gstin: string;
    business_name: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
};

export type AddDealerCustomer = {
    email: string;
    phone: string;
    fullname: string;
    gstin: string;
    business: string;
    shippingAddress: { pncd: string; loc: string; dst: string; stcd: string; adr: string };
    billingAddress: { pncd: string; loc: string; dst: string; stcd: string; adr: string };
    otp: string;
};

// Register a dealer
export const registerDealerCustomer = async (payload: AddDealerCustomer) => {
    console.log('URL =>', `${apiURL}/customer/dealers/register`);
    return await axios.post(`${apiURL}/customer/dealers/register`, payload);
};

// Get all non-approved dealers
export const getAllNonApprovedDealerCustomer = async () => {
    return await axios.get(`${apiURL}/customer/dealers/not-approved/all`);
};

// Fetch all sorts of customers API endpoint
export const getAllCustomers = async () => {
    return await axios.get(`${apiURL}/customer/all`);
};

// Fetch all distributors API endpoint
export const getAllDistributors = async () => {
    return await axios.get(`${apiURL}/customer/distributor`);
};

// Fetch all approved dealers API
export const getAllApprovedDealers = async () => {
    return await axios.get(`${apiURL}/customer/dealers/approved`);
};

// Fetch all not approved dealers API
export const getAllNotApprovedDealers = async () => {
    return await axios.get(`${apiURL}/customer/dealers/not-approved`);
};

// Delete Dealer API
export const deleteDealer = async (dealer_id: string) => {
    return await axios.delete(`${apiURL}/customer/dealers/${dealer_id}`);
};

// Approve a dealer API
export const approveDealer = async (dealer_id: string) => {
    return await axios.put(`${apiURL}/customer/dealers/approved/${dealer_id}`);
};

// Disapprove a dealer API
export const disapproveDealer = async (dealer_id: string) => {
    return await axios.put(`${apiURL}/customer/dealers/not-approved/${dealer_id}`);
};

// Get single dealer
export const fetchSingleDealer = async (dealer_id: string) => {
    return await axios.get(`${apiURL}/customer/dealers/view-edit/${dealer_id}`);
};

// Update dealer's info
export const updateDealer = async (dealer_id: string, data: Dealer) => {
    return await axios.put(`${apiURL}/customer/dealers/edit/${dealer_id}`, data);
};

// Approve a technician API
export const approveTechnician = async (dealer_id: string, tech_id: string) => {
    return await axios.put(`${apiURL}/technician/approve/${dealer_id}/${tech_id}`);
};

// Dispprove a technician API
export const disApproveTechnician = async (dealer_id: string, tech_id: string) => {
    return await axios.put(`${apiURL}/technician/disapprove/${dealer_id}/${tech_id}`);
};

// Fetch all technicians API
export const getAllTechnicians = async () => {
    return await axios.get(`${apiURL}/customer/technicians`);
};

// Delete Technician API
export const deleteTechnician = async (tech_id: string) => {
    return await axios.delete(`${apiURL}/customer/technicians/${tech_id}`);
};

// Fetch all backoffices API
export const getAllBackOffices = async () => {
    return await axios.get(`${apiURL}/customer/back-office`);
};

// Approve a back office API
export const approveBackOffice = async (dealer_id: string, backoffice_id: string) => {
    return await axios.put(`${apiURL}/back-office/approve/${dealer_id}/${backoffice_id}`);
};

// Dispprove a back office API
export const disApproveBackOffice = async (dealer_id: string, backoffice_id: string) => {
    return await axios.put(`${apiURL}/back-office/disapprove/${dealer_id}/${backoffice_id}`);
};

// Delete Back Office API
export const deleteBackOffice = async (backoffice_id: string) => {
    return await axios.delete(`${apiURL}/customer/back-office/${backoffice_id}`);
};

// Assign dealer to distributor
export const assignToDistributor = async (dealer_id: string) => {
    return await axios.put(`${apiURL}/customer/distributor/${dealer_id}`);
};

// Assign distributor to dealer
export const assignDistributorToDealer = async (dealer_id: string) => {
    return await axios.put(`${apiURL}/customer/distributor-dealer/${dealer_id}`);
};

// Update dealer's Profile Picture
export const updatePfp = async (dealer_id: string, profile_pic: string) => {
    return await axios.put(`${apiURL}/customer/dealers/edit/${dealer_id}`, { profile_pic });
};
