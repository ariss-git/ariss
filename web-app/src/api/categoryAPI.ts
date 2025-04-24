import { apiURL } from './apiURL';
import axios from 'axios';

export const addCategoryAPI = async (category_name: string, category_image: string) => {
    return await axios.post(`${apiURL}/products/category`, { category_name, category_image });
};

export const fetchAllCategories = async () => {
    return await axios.get(`${apiURL}/products/category`);
};

export const fetchSingleCategory = async (category_id: string) => {
    return await axios.get(`${apiURL}/products/category/${category_id}`);
};

export const updateCategory = async (category_id: string, category_name: string, category_image: string) => {
    return await axios.put(`${apiURL}/products/category/${category_id}`, { category_name, category_image });
};

export const deleteCategory = async (category_id: string) => {
    return await axios.delete(`${apiURL}/products/category/${category_id}`);
};
