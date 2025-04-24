import axios from 'axios';
import { apiURL } from './apiURL';

type Discount = {
    dealer_id: string;
    product_id: string;
    discount_type: string;
    expiry_date: string;
    amount: number; // amount should be a number
    percentage: number; // percentage should be a number
};

// Assign discount to a dealer on a product API
export const assignDiscount = async (discount: Discount) => {
    return axios.post(`${apiURL}/discount`, discount);
};

// Fetch all discounts
export const getAllDiscounts = async () => {
    return await axios.get(`${apiURL}/discount`);
};

// Delete a discount
export const deleteDiscount = async (discount_id: string) => {
    return await axios.delete(`${apiURL}/discount/${discount_id}`);
};

// Get all dealers name for discount
export const dealerNamesDiscount = async () => {
    return await axios.get(`${apiURL}/customer/dealers/approved`);
};

// Get all product names for discount
export const productNamesDiscount = async () => {
    return await axios.get(`${apiURL}/products`);
};
