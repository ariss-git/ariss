import axios from 'axios';
import { apiURL } from './apiURL';

// Fetch all RMA requests
export const getAllRMA = async () => {
    return axios.get(`${apiURL}/rma`);
};

// Fetch single RMA request
export const getSingleRMA = async (rma_id: string) => {
    return axios.get(`${apiURL}/rma/${rma_id}`);
};

// Accept RMA request
export const acceptRMA = async (rma_id: string) => {
    return axios.put(`${apiURL}/rma/accept/${rma_id}`);
};

// Reject RMA request
export const rejectRMA = async (rma_id: string) => {
    return axios.put(`${apiURL}/rma/reject/${rma_id}`);
};

// Resolved RMA request
export const resolvedRMA = async (rma_id: string) => {
    return axios.put(`${apiURL}/rma/resolve/${rma_id}`);
};

// Delete RMA request
export const deleteRMA = async (rma_id: string) => {
    return axios.delete(`${apiURL}/rma/${rma_id}`);
};
