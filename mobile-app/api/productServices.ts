import axios from 'axios';

export const API_URL = 'http://localhost:5000/api';

// Get all categories
export const fetchAllCategories = async () => {
  return axios.get(`${API_URL}/products/category`);
};

// Get subcategory by their category
export const getSubcategoryByCategory = async (category_id: string) => {
  return axios.get(`${API_URL}/products/category/sub/${category_id}`);
};

// Get all products by their subcategory
export const getProductBySubcategory = async (subcategory_id: string) => {
  return axios.get(`${API_URL}/products/sub-pro/${subcategory_id}`);
};

// Get single product
export const getSingleProduct = async (product_id: string) => {
  return axios.get(`${API_URL}/products/${product_id}`);
};

// Get all products
export const getAllProducts = async () => {
  return axios.get(`${API_URL}/products`);
};
