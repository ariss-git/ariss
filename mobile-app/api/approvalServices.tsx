import axios from 'axios';

import { API_URL } from './productServices';

export const getTechnicianProfileForDealer = async (dealer_id: string) => {
  return axios.get(`${API_URL}/technician/approvals/${dealer_id}`);
};

export const getBackofficeProfileForDealer = async (dealer_id: string) => {
  return axios.get(`${API_URL}/back-office/approvals/${dealer_id}`);
};
