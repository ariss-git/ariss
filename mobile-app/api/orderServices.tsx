import axios from 'axios';

import { API_URL } from './productServices';

interface Order {
  username: string;
  usertype: string;
  business_name: string;
  shipping_address: string;
  product_id: string;
  total_amount: number;
  quantity: number;
  coupon_code: string;
  delivery_date: string;
  payment_mode: string;
}

interface Ledger {
  product_id: string;
  total: number;
  balance_due: number;
  quantity: number;
  user_id: string;
  username: string;
  usertype: string;
  business_name: string;
  shipping_address: string;
}

interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createOrderAPI = async (data: Order) => {
  return axios.post(`${API_URL}/order/create`, data);
};

export const verifyPaymentAPI = async (data: PaymentVerificationData) => {
  return axios.post(`${API_URL}/payment/verify`, data);
};

export const createLedgerAPI = async (data: Ledger) => {
  return axios.post(`${API_URL}/ledger/create`, data);
};

export const fetchLedget = async (user_id: string) => {
  return axios.get(`${API_URL}/ledger/${user_id}`);
};
