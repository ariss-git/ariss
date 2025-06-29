// src/controllers/product.controller.ts
import { addCategoryService, addProductService, addSubcategoryService, deleteCategoryService, deleteProductService, deleteSubcategoryService, getAllCategoriesService, getAllCategoryNameService, getAllProductsByCategoryService, getAllProductsBySubcategoryService, getAllProductsService, getAllSubcategoriesService, getAllSubcategoriesUnderCategoryService, getSingleCategoryService, getSingleProductService, getSingleSubcategoryService, updateCategoryService, updateProductService, updateSubcategoryService, } from '../services/product.service.js';
// Controller to add a product
export const addProductController = async (req, res) => {
    try {
        const { product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords, product_price, subcategory_name, category_name, } = req.body;
        if (!product_title ||
            !product_type ||
            !product_description ||
            !product_image ||
            !product_warranty ||
            !product_quantity ||
            !product_label ||
            !product_visibility ||
            !product_keywords ||
            !product_price ||
            !subcategory_name ||
            !category_name) {
            return res.status(400).json({ success: false, message: 'Fields cannot be left null' });
        }
        const product = await addProductService(product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords, product_price, subcategory_name, category_name);
        return res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to get all the products
export const getAllProductsController = async (req, res) => {
    try {
        const products = await getAllProductsService();
        return res.status(200).json({ success: true, total: products.length, data: products });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};
// Controller to get single product
export const getSingleProductController = async (req, res) => {
    try {
        const { product_id } = req.params;
        const product = await getSingleProductService(product_id);
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};
// Controller to get single product
export const getProductsController = async (req, res) => {
    try {
        const { product_id } = req.params;
        if (!product_id) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }
        const product = await getSingleProductService(product_id);
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};
// Controller to get products by their category
export const getProductsByCategoryController = async (req, res) => {
    try {
        const { category_id } = req.params;
        if (!category_id) {
            return res.status(400).json({ success: false, message: 'Category ID is required' });
        }
        const products = await getAllProductsByCategoryService(category_id);
        return res.status(200).json({
            success: true,
            totalSubcategories: products.subcategory.length,
            subcategoriesData: products.subcategory,
            totalProducts: products.product.length,
            productData: products.product,
        });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};
// Controller to get products by their subcategory
export const getProductsBySubcategoryController = async (req, res) => {
    try {
        const { subcategory_id } = req.params;
        if (!subcategory_id) {
            return res.status(400).json({ success: false, message: 'Category ID is required' });
        }
        const products = await getAllProductsBySubcategoryService(subcategory_id);
        return res.status(200).json({
            success: true,
            totalProducts: products.length,
            data: products,
        });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};
// Controller to update the product
export const updateProductController = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords, } = req.body;
        const product = await updateProductService(product_id, product_title, product_sku, product_type, product_description, product_image, product_warranty, product_quantity, product_label, product_visibility, product_usps, product_keywords);
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};
// Controller to delete a product
export const deleteProductController = async (req, res) => {
    try {
        const { product_id } = req.params;
        if (!product_id) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }
        const product = await deleteProductService(product_id);
        return res
            .status(200)
            .json({ success: true, message: `${product.product_title} deleted successfully` });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to add Subcategory for a category
export const addSubcategoryController = async (req, res) => {
    try {
        const { subcategory_name, subcategory_image, category_name } = req.body;
        if (!subcategory_name || !subcategory_image || !category_name) {
            return res.status(400).json({ success: false, message: 'Fields cannot be left null' });
        }
        const subcategory = await addSubcategoryService(subcategory_name, subcategory_image, category_name);
        return res.status(201).json({ success: true, data: subcategory });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to get all subcategories for a product
export const getAllSubcategoriesController = async (_req, res) => {
    try {
        const categories = await getAllSubcategoriesService();
        if (!categories) {
            return res.status(404).json({ success: false, message: 'Subcategory table is empty' });
        }
        return res.status(200).json({ success: true, total: categories.length, data: categories });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to fetch Subcategories with respect to their ID
export const getSingleSubcategoryController = async (req, res) => {
    try {
        const { subcategory_id } = req.params;
        if (!subcategory_id) {
            return res.status(400).json({ success: false, message: 'Category name field is required' });
        }
        const subcategory = await getSingleSubcategoryService(subcategory_id);
        return res.status(201).json({ success: true, total: subcategory.length, data: subcategory });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to get all subcategories of a category
export const getAllSubcategoriesUnderCategoryController = async (req, res) => {
    try {
        const { category_id } = req.params;
        if (!category_id) {
            return res.status(400).json({ success: false, message: 'Category ID is required' });
        }
        const subcategories = await getAllSubcategoriesUnderCategoryService(category_id);
        return res.status(200).json({ success: true, total: subcategories.length, data: subcategories });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to update Subcategory
export const updateSubcategoryController = async (req, res) => {
    try {
        const { subcategory_id } = req.params;
        const { subcategory_name, subcategory_image } = req.body;
        if (!subcategory_id) {
            return res.status(404).json({ success: false, message: 'Subcategory ID not found' });
        }
        if (!subcategory_name || !subcategory_image) {
            return res.status(404).json({ success: false, message: 'Subcategory name and image not found' });
        }
        const subcategory = await updateSubcategoryService(subcategory_id, subcategory_name, subcategory_image);
        return res.status(201).json({ success: true, data: subcategory });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to delete Subcategories with respect to their category
export const deleteSubcategoryController = async (req, res) => {
    try {
        const { category_id } = req.params;
        if (!category_id) {
            return res.status(400).json({ success: false, message: 'Category name field is required' });
        }
        const subcategory = await deleteSubcategoryService(category_id);
        return res
            .status(201)
            .json({ success: true, message: `Subcategory: ${subcategory.subcategory_name} deleted` });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to add category for a product
export const addCategoryController = async (req, res) => {
    try {
        const { category_name, category_image } = req.body;
        if (!category_name || !category_image) {
            return res.status(400).json({ success: false, message: 'Name and Image fields cannot be null' });
        }
        const category = await addCategoryService(category_name, category_image);
        return res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to get all categories for a product
export const getAllCategoriesController = async (_req, res) => {
    try {
        const categories = await getAllCategoriesService();
        if (!categories) {
            return res.status(404).json({ success: false, message: 'Category table is empty' });
        }
        return res.status(200).json({ success: true, total: categories.length, data: categories });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to get all category names for a product
export const getAllCategoryNameController = async (_req, res) => {
    try {
        const categories = await getAllCategoryNameService();
        if (!categories) {
            return res.status(404).json({ success: false, message: 'Category table is empty' });
        }
        return res.status(200).json({ success: true, total: categories.length, data: categories });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to get single category for a product
export const getSingleCategoryController = async (req, res) => {
    try {
        const { category_id } = req.params;
        const category = await getSingleCategoryService(category_id);
        return res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateCategoryController = async (req, res) => {
    try {
        const { category_id } = req.params;
        const { category_name, category_image } = req.body;
        if (!category_id) {
            return res.status(404).json({ success: false, message: 'Category ID not found' });
        }
        const category = await updateCategoryService(category_id, category_name, category_image);
        return res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to delete single category for a product
export const deleteCategoryController = async (req, res) => {
    try {
        const { category_id } = req.params;
        const category = await deleteCategoryService(category_id);
        return res
            .status(200)
            .json({ success: true, message: `Category: ${category.category_id} deleted successfully` });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
