import axios from 'axios';
import { apiURL } from './apiURL';

export const addSubcategory = async (
    category_name: string,
    subcategory_name: string,
    subcategory_image: string
) => {
    return await axios.post(`${apiURL}/products/category/sub`, {
        category_name,
        subcategory_name,
        subcategory_image,
    });
};

export const getCategoryNames = async () => {
    return await axios.get(`${apiURL}/products/category/names`);
};

export const fetchSingleSubcategory = (id: string) => {
    return axios.get(`${apiURL}/products/category/sub/${id}`);
};

export const updateSubcategory = (id: string, name: string, image: string) => {
    return axios.put(`${apiURL}/products/category/sub/${id}`, {
        subcategory_name: name,
        subcategory_image: image,
    });
};
