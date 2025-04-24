import axios from 'axios';

import { API_URL } from './productServices';

// Fetch all discounts for a dealer API
export const fetchAllDiscounts = async (dealer_id: string) => {
  return axios.get(`${API_URL}/discount/app/${dealer_id}`);
};
