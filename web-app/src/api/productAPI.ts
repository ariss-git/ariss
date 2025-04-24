import axios from 'axios';
import { apiURL } from './apiURL';

interface Product {
    product_title: string;
    product_sku: string;
    product_type: string;
    product_description: string;
    product_image: string[];
    product_warranty: number;
    product_quantity: number;
    product_label: string;
    product_visibility: string;
    product_usps: string;
    product_keywords: string[];
    product_price: number;
    subcategory_name: string;
    category_name: string;
}

export const addProduct = async (products: Product) => {
    return await axios.post(`${apiURL}/products`, products);
};

export const getAllProducts = async () => {
    return await axios.get(`${apiURL}/products`);
};

export const getAllSubcategoriesForProduct = async () => {
    return await axios.get(`${apiURL}/products/category/sub/all`);
};

export const deleteProduct = async (product_id: string) => {
    return await axios.delete(`${apiURL}/products/${product_id}`);
};

export const getSingleProduct = async (product_id: string) => {
    return axios.get(`${apiURL}/products/${product_id}`);
};
