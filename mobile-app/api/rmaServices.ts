import axios from 'axios';

import { API_URL } from './productServices';

type RMAType = {
  first_name: string;
  last_name: string;
  business_name: string;
  gstin: string;
  phone: string;
  email: string;
  user_type: string;
  product_name: string;
  product_serial: string;
  product_issue: string;
  product_images: string[];
};

// File RMA Request
export const fileRMA = async (rmaData: RMAType) => {
  return axios.post(`${API_URL}/rma`, rmaData);
};
