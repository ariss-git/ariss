import axios from 'axios';

import { API_URL } from './productServices';

export const getTechnicianProfileForDealer = async (dealer_id: string) => {
  return axios.get(`${API_URL}/technician/approvals/${dealer_id}`);
};

export const getBackofficeProfileForDealer = async (dealer_id: string) => {
  return axios.get(`${API_URL}/back-office/approvals/${dealer_id}`);
};

export const approveTechnician = async (dealer_id: string, tech_id: string) => {
  return axios.put(`${API_URL}/technician/approve/${dealer_id}/${tech_id}`);
};

export const approveBackoffice = async (dealer_id: string, backoffice_id: string) => {
  return axios.put(`${API_URL}/back-office/approve/${dealer_id}/${backoffice_id}`);
};

export const disapproveBackoffice = async (dealer_id: string, backoffice_id: string) => {
  return axios.put(`${API_URL}/back-office/disapprove/${dealer_id}/${backoffice_id}`);
};

export const disapproveTechnician = async (dealer_id: string, tech_id: string) => {
  return axios.put(`${API_URL}/technician/disapprove/${dealer_id}/${tech_id}`);
};

export const deleteTechnician = async (tech_id: string) => {
  return axios.delete(`${API_URL}/customer/technicians/${tech_id}`);
};

export const deleteBackoffice = async (backoffice_id: string) => {
  return axios.delete(`${API_URL}/customer/back-office/${backoffice_id}`);
};
